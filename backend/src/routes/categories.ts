import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Listar categorias
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

// Buscar categoria por slug
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          include: { stock: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    res.json({
      ...category,
      products: category.products.map(p => ({
        ...p,
        images: JSON.parse(p.images),
        sizes: JSON.parse(p.sizes),
        colors: JSON.parse(p.colors),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});

export default router;
