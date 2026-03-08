# Pod Gorillas

Sistema completo de e-commerce para venda de PODs e Vapes, com integração WhatsApp e pagamento via PIX (AbacatePay).

## Stack

- **Backend:** Node.js + Express + TypeScript + Prisma (SQLite)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Integrações:** AbacatePay (PIX), WhatsApp Cloud API (Meta)

## Estrutura

```
gorillas/
├── backend/          # API REST
├── frontend/         # Loja + Admin
├── whatsapp-bot/     # Bot WhatsApp (integrado no backend)
└── docker-compose.yml
```

## Instalação

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais

# Inicializar banco de dados
npx prisma db push
npx prisma generate

# Seed (dados de exemplo)
npm run db:seed

# Rodar em desenvolvimento
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Credenciais Padrão (Admin)

- **Email:** admin@podgorillas.com.br
- **Senha:** admin123

## Configurações

### AbacatePay

1. Crie uma conta em https://abacatepay.com
2. Obtenha a API Key no painel
3. Configure o webhook para: `https://seudominio.com/api/payments/webhook`
4. Atualize o `.env` com as credenciais

### WhatsApp Cloud API

1. Acesse https://developers.facebook.com
2. Crie um app Business
3. Configure WhatsApp > Configurações > Tokens permanentes
4. Configure o webhook para: `https://seudominio.com/api/whatsapp/webhook`
5. Token de verificação: use o mesmo do `.env` (WHATSAPP_VERIFY_TOKEN)
6. Atualize o `.env` com as credenciais

## Fluxo WhatsApp

O bot responde automaticamente com menu interativo:

```
1 - Ver catálogo de produtos
2 - Acessar a loja online
3 - Consultar pedido
4 - Falar com atendente
5 - Horário de funcionamento
```

## Deploy com Docker

```bash
docker-compose up -d
```

## Funcionalidades

### Loja
- Catálogo de produtos com filtros
- Carrinho de compras
- Checkout com PIX (5% desconto)
- Frete grátis acima de R$150
- Verificação de idade 18+
- Design dark mode, mobile-first

### Admin
- Dashboard com métricas
- Gestão de pedidos (status workflow)
- Gestão de produtos
- Controle de estoque
- Alertas de estoque baixo

### WhatsApp
- Menu interativo automatizado
- Consulta de catálogo
- Consulta de status de pedido
- Direcionamento para atendente

## Licença

Projeto privado - Pod Gorillas
