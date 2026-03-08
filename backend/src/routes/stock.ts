import { Router, Response } from 'express';
import { prisma } from '../index';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = Router();

// Buscar estoque de um produto
router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const stock = await prisma.stock.findMany({
      where: { productId },
    });

    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

// Atualizar estoque (admin)
router.put(
  '/:stockId',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
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
  }
);

// Criar entrada de estoque (admin)
router.post(
  '/',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    const { productId, size, color, quantity } = req.body;

    try {
      const stock = await prisma.stock.upsert({
        where: { productId_size_color: { productId, size, color } },
        update: { quantity: { increment: quantity } },
        create: { productId, size, color, quantity },
      });

      res.json(stock);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar estoque' });
    }
  }
);

export default router;
