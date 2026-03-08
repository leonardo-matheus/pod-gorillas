import axios from 'axios';
import { config } from '../config';
import { prisma } from '../index';

const api = axios.create({
  baseURL: `https://graph.facebook.com/v18.0/${config.whatsapp.phoneNumberId}`,
  headers: {
    'Authorization': `Bearer ${config.whatsapp.accessToken}`,
    'Content-Type': 'application/json',
  },
});

export const whatsappService = {
  async sendMessage(to: string, text: string): Promise<void> {
    try {
      await api.post('/messages', {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: text },
      });
    } catch (error: any) {
      console.error('Erro ao enviar WhatsApp:', error.response?.data || error.message);
    }
  },

  async sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<void> {
    try {
      await api.post('/messages', {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: bodyText },
          action: {
            buttons: buttons.map(b => ({
              type: 'reply',
              reply: { id: b.id, title: b.title },
            })),
          },
        },
      });
    } catch (error: any) {
      console.error('Erro ao enviar botoes:', error.response?.data || error.message);
    }
  },

  async sendInteractiveList(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>
  ): Promise<void> {
    try {
      await api.post('/messages', {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: { text: bodyText },
          action: {
            button: buttonText,
            sections,
          },
        },
      });
    } catch (error: any) {
      console.error('Erro ao enviar lista:', error.response?.data || error.message);
    }
  },

  getMainMenu(): string {
    return `*Pod Gorillas* - Atendimento

Escolha uma opcao digitando o numero:

*1* - Ver catalogo de produtos
*2* - Acessar a loja online
*3* - Consultar pedido
*4* - Falar com atendente
*5* - Horario de funcionamento

Ou acesse: https://podgorillas.com.br`;
  },

  getCatalogMenu(): string {
    return `*Nosso Catalogo*

Escolha a categoria:

*1* - Camisetas
*2* - Moletons
*3* - Bones
*4* - Canecas
*5* - Ver todos os produtos
*0* - Voltar ao menu`;
  },

  getBusinessHours(): string {
    return `*Horario de Atendimento*

Segunda a Sexta: 9h as 18h
Sabado: 9h as 13h
Domingo: Fechado

Para compras online, acesse:
https://podgorillas.com.br

*0* - Voltar ao menu`;
  },

  async getOrCreateSession(phone: string) {
    let session = await prisma.whatsAppSession.findUnique({
      where: { phone },
    });

    if (!session) {
      session = await prisma.whatsAppSession.create({
        data: { phone, state: 'menu' },
      });
    }

    return session;
  },

  async updateSession(phone: string, state: string, context?: any) {
    await prisma.whatsAppSession.update({
      where: { phone },
      data: {
        state,
        context: context ? JSON.stringify(context) : null,
        updatedAt: new Date(),
      },
    });
  },

  async processMessage(phone: string, message: string): Promise<string> {
    const session = await this.getOrCreateSession(phone);
    const input = message.trim().toLowerCase();

    switch (session.state) {
      case 'menu':
        return this.handleMainMenu(phone, input);

      case 'catalog':
        return this.handleCatalogMenu(phone, input);

      case 'order_status':
        return this.handleOrderStatus(phone, input);

      case 'support':
        return this.handleSupport(phone, input);

      default:
        await this.updateSession(phone, 'menu');
        return this.getMainMenu();
    }
  },

  async handleMainMenu(phone: string, input: string): Promise<string> {
    switch (input) {
      case '1':
        await this.updateSession(phone, 'catalog');
        return this.getCatalogMenu();

      case '2':
        return `Acesse nossa loja online:\nhttps://podgorillas.com.br\n\n*0* - Voltar ao menu`;

      case '3':
        await this.updateSession(phone, 'order_status');
        return `*Consultar Pedido*\n\nDigite o numero do seu pedido:\n(Ex: GOR-12345)\n\n*0* - Voltar ao menu`;

      case '4':
        await this.updateSession(phone, 'support');
        return `*Atendimento Humano*\n\nUm de nossos atendentes vai te responder em breve!\n\nEnquanto isso, descreva sua duvida:\n\n*0* - Voltar ao menu`;

      case '5':
        return this.getBusinessHours();

      default:
        return this.getMainMenu();
    }
  },

  async handleCatalogMenu(phone: string, input: string): Promise<string> {
    if (input === '0') {
      await this.updateSession(phone, 'menu');
      return this.getMainMenu();
    }

    const categories: Record<string, string> = {
      '1': 'camisetas',
      '2': 'moletons',
      '3': 'bones',
      '4': 'canecas',
      '5': 'todos',
    };

    const category = categories[input];
    if (!category) {
      return this.getCatalogMenu();
    }

    // Buscar produtos
    const where = category === 'todos'
      ? { active: true }
      : { active: true, category: { slug: category } };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    if (products.length === 0) {
      return `Nenhum produto encontrado nessa categoria.\n\n${this.getCatalogMenu()}`;
    }

    let response = `*Produtos${category !== 'todos' ? ` - ${category.charAt(0).toUpperCase() + category.slice(1)}` : ''}*\n\n`;

    products.forEach((p, i) => {
      response += `*${i + 1}. ${p.name}*\n`;
      response += `R$ ${p.price.toFixed(2).replace('.', ',')}\n`;
      response += `https://podgorillas.com.br/produto/${p.slug}\n\n`;
    });

    response += `\n*0* - Voltar ao menu`;
    return response;
  },

  async handleOrderStatus(phone: string, input: string): Promise<string> {
    if (input === '0') {
      await this.updateSession(phone, 'menu');
      return this.getMainMenu();
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber: input.toUpperCase() },
      include: { items: true },
    });

    if (!order) {
      return `Pedido nao encontrado.\n\nVerifique o numero e tente novamente:\n\n*0* - Voltar ao menu`;
    }

    const statusMap: Record<string, string> = {
      'pending': 'Aguardando pagamento',
      'paid': 'Pagamento confirmado',
      'processing': 'Em producao',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado',
    };

    let response = `*Pedido ${order.orderNumber}*\n\n`;
    response += `Status: ${statusMap[order.status] || order.status}\n`;
    response += `Total: R$ ${order.total.toFixed(2).replace('.', ',')}\n`;
    response += `Data: ${order.createdAt.toLocaleDateString('pt-BR')}\n`;

    if (order.trackingCode) {
      response += `\nRastreio: ${order.trackingCode}\n`;
    }

    response += `\nItens:\n`;
    order.items.forEach(item => {
      response += `- ${item.quantity}x ${item.name} (${item.size}/${item.color})\n`;
    });

    response += `\n*0* - Voltar ao menu`;

    await this.updateSession(phone, 'menu');
    return response;
  },

  async handleSupport(phone: string, input: string): Promise<string> {
    if (input === '0') {
      await this.updateSession(phone, 'menu');
      return this.getMainMenu();
    }

    // Aqui você pode integrar com um sistema de tickets ou notificar admin
    // Por enquanto, apenas confirma o recebimento
    await this.updateSession(phone, 'menu');

    return `Recebemos sua mensagem!\n\nUm atendente vai responder em breve.\n\n${this.getMainMenu()}`;
  },
};
