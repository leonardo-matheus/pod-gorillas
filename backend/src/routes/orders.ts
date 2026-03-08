import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest, optionalAuth } from '../middlewares/auth';
import { abacatePayService } from '../services/abacatepay';

const router = Router();

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `GOR${timestamp}${random}`;
}

// Listar pedidos do usuário (autenticado)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

// Buscar pedido por número (público - para acompanhamento)
router.get('/track/:orderNumber', async (req: Request, res: Response) => {
  const { orderNumber } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      deliveryType: order.deliveryType,
      createdAt: order.createdAt,
      items: order.items,
      pixCode: order.status === 'pending' ? order.pixCode : undefined,
      pixQrCode: order.status === 'pending' ? order.pixQrCode : undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// Criar pedido (com ou sem login)
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliveryType,
    shippingCep,
    shippingStreet,
    shippingNumber,
    shippingComp,
    shippingNeigh,
    shippingCity,
    shippingState,
    notes,
    items, // array de { productId, flavor, quantity }
    useCashback,
  } = req.body;

  // Validações
  if (!customerPhone || !customerName) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  const cleanPhone = customerPhone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return res.status(400).json({ error: 'Telefone inválido' });
  }

  try {
    // Buscar configurações
    const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
    const deliveryFee = settings?.deliveryFee || 10;
    const cashbackPercent = settings?.cashbackPercent || 3;

    // Calcular subtotal e verificar estoque
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { stock: true },
      });

      if (!product) {
        return res.status(400).json({ error: `Produto não encontrado` });
      }

      const stockItem = product.stock.find(s => s.flavor === item.flavor);
      if (!stockItem || stockItem.quantity < item.quantity) {
        return res.status(400).json({
          error: `${product.name} (${item.flavor}) sem estoque suficiente`,
        });
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        flavor: item.flavor,
        quantity: item.quantity,
      });
    }

    // Calcular frete
    const isDelivery = deliveryType === 'delivery';
    const shipping = isDelivery ? deliveryFee : 0;

    // Calcular cashback (apenas para usuários logados)
    let cashbackUsed = 0;
    let user = null;

    if (req.userId) {
      user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (user && useCashback && user.cashback > 0) {
        cashbackUsed = Math.min(user.cashback, subtotal * 0.1); // máximo 10% do subtotal
      }
    }

    const total = subtotal + shipping - cashbackUsed;
    const cashbackEarned = user ? (subtotal * cashbackPercent) / 100 : 0;

    const orderNumber = generateOrderNumber();

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.userId || null,
        subtotal,
        shipping,
        cashbackUsed,
        cashbackEarned,
        total,
        customerName,
        customerPhone: cleanPhone,
        customerEmail: customerEmail || null,
        deliveryType,
        shippingCep: isDelivery ? shippingCep : null,
        shippingStreet: isDelivery ? shippingStreet : null,
        shippingNumber: isDelivery ? shippingNumber : null,
        shippingComp: isDelivery ? shippingComp : null,
        shippingNeigh: isDelivery ? shippingNeigh : null,
        shippingCity: isDelivery ? shippingCity : null,
        shippingState: isDelivery ? shippingState : null,
        notes,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Criar pagamento PIX
    let pixCode = '';
    let pixQrCode = '';

    try {
      const payment = await abacatePayService.createPixPayment({
        amount: Math.round(total * 100),
        description: `Pedido ${orderNumber} - Pod Gorillas`,
        externalId: order.id,
        customerName,
        customerEmail: customerEmail || 'cliente@podgorillas.com.br',
        customerPhone: cleanPhone,
      });

      pixCode = payment.pixCode;
      pixQrCode = payment.qrCodeBase64;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: payment.id,
          pixCode,
          pixQrCode,
        },
      });
    } catch (paymentError) {
      // Se pagamento falhar, usar PIX simulado para testes
      console.warn('AbacatePay não configurado, usando PIX simulado');
      pixCode = `00020126580014br.gov.bcb.pix0136${orderNumber}@podgorillas.com.br5204000053039865802BR5913POD_GORILLAS6006MATAO62070503***6304`;

      await prisma.order.update({
        where: { id: order.id },
        data: { pixCode },
      });
    }

    // Decrementar estoque
    for (const item of items) {
      await prisma.stock.update({
        where: { productId_flavor: { productId: item.productId, flavor: item.flavor } },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Debitar cashback usado
    if (cashbackUsed > 0 && user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { cashback: { decrement: cashbackUsed } },
      });
    }

    res.status(201).json({
      ...order,
      pixCode,
      pixQrCode,
      cashbackEarned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

export default router;
