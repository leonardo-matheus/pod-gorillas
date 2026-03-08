import express from 'express';
import cors from 'cors';
import { config } from './config';
import { PrismaClient } from '@prisma/client';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import stockRoutes from './routes/stock';
import paymentRoutes from './routes/payments';
import whatsappRoutes from './routes/whatsapp';
import adminRoutes from './routes/admin';
import cepRoutes from './routes/cep';

const app = express();
export const prisma = new PrismaClient();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', /192\.168\.\d+\.\d+/],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cep', cepRoutes);

// Settings público (para frontend)
app.get('/api/settings', async (_, res) => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
const host = '0.0.0.0';
app.listen(config.port, host, () => {
  console.log(`Pod Gorillas API rodando em http://${host}:${config.port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
