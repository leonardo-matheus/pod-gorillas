import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Listar produtos
router.get('/', async (req: Request, res: Response) => {
  const { category, featured, search, limit = '50', offset = '0' } = req.query;

  try {
    const where: any = { active: true };

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          stock: true,
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      flavors: JSON.parse(p.flavors),
      totalStock: p.stock.reduce((sum, s) => sum + s.quantity, 0),
    }));

    res.json({ products: formattedProducts, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// Buscar produto por slug
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        stock: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({
      ...product,
      images: JSON.parse(product.images),
      flavors: JSON.parse(product.flavors),
      totalStock: product.stock.reduce((sum, s) => sum + s.quantity, 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

export default router;
