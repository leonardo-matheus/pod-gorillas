import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();

router.use(authenticate, requireAdmin);

// Dashboard stats
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      totalProducts,
      lowStockCount,
      recentOrders,
      revenue,
      todayRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.product.count({ where: { active: true } }),
      prisma.stock.count({ where: { quantity: { lte: 2 } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: ['paid', 'confirmed', 'preparing', 'ready', 'delivered'] } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: ['paid', 'confirmed', 'preparing', 'ready', 'delivered'] },
          createdAt: { gte: today },
        },
        _sum: { total: true },
      }),
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      todayOrders,
      totalProducts,
      lowStockCount,
      recentOrders,
      totalRevenue: revenue._sum.total || 0,
      todayRevenue: todayRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Listar pedidos
router.get('/orders', async (req: AuthRequest, res: Response) => {
  const { status, limit = '50', offset = '0' } = req.query;

  try {
    const where = status ? { status: status as string } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true, user: { select: { name: true, phone: true, cashback: true } } },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({ orders, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
});

// Atualizar status do pedido
router.patch('/orders/:orderId', async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const { status, trackingCode } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const updateData: any = { status };
    if (trackingCode) updateData.trackingCode = trackingCode;

    // Se confirmando pedido, creditar cashback
    if (status === 'confirmed' && order.userId && order.cashbackEarned > 0) {
      await prisma.user.update({
        where: { id: order.userId },
        data: { cashback: { increment: order.cashbackEarned } },
      });
      updateData.confirmedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// Produtos
router.get('/products', async (_req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, stock: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      flavors: JSON.parse(p.flavors),
      totalStock: p.stock.reduce((sum, s) => sum + s.quantity, 0),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

router.post('/products', async (req: AuthRequest, res: Response) => {
  const { name, slug, description, price, puffs, images, flavors, categoryId, featured } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        puffs,
        images: JSON.stringify(images),
        flavors: JSON.stringify(flavors),
        categoryId,
        featured: featured || false,
      },
    });

    // Criar estoque zerado para cada sabor
    for (const flavor of flavors) {
      await prisma.stock.create({
        data: { productId: product.id, flavor, quantity: 0 },
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

router.put('/products/:productId', async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  const { name, slug, description, price, puffs, images, flavors, categoryId, active, featured } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        price,
        puffs,
        images: JSON.stringify(images),
        flavors: JSON.stringify(flavors),
        categoryId,
        active,
        featured,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Estoque
router.get('/stock', async (_req: AuthRequest, res: Response) => {
  try {
    const stock = await prisma.stock.findMany({
      include: { product: true },
      orderBy: { quantity: 'asc' },
    });

    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

router.patch('/stock/:stockId', async (req: AuthRequest, res: Response) => {
  const { stockId } = req.params;
  const { quantity } = req.body;

  try {
    const stock = await prisma.stock.update({
      where: { id: stockId },
      data: { quantity },
    });

    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

// Configurações
router.get('/settings', async (_req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'main' } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 'main' } });
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

router.put('/settings', async (req: AuthRequest, res: Response) => {
  const data = req.body;

  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: data,
      create: { id: 'main', ...data },
    });

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
});

export default router;
