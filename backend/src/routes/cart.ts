import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { optionalAuth, AuthRequest } from '../middlewares/auth';

const router = Router();

// Obter carrinho (por sessão ou usuário)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;

  try {
    let cart = null;

    if (req.userId) {
      cart = await prisma.cart.findUnique({
        where: { userId: req.userId },
        include: { items: { include: { product: true } } },
      });
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId },
        include: { items: { include: { product: true } } },
      });
    }

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: JSON.parse(item.product.images)[0],
      flavor: item.flavor,
      quantity: item.quantity,
    }));

    res.json({ id: cart.id, items: formattedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
});

// Adicionar item
router.post('/items', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { productId, flavor, quantity = 1 } = req.body;
  const sessionId = req.headers['x-session-id'] as string;

  try {
    // Verificar estoque
    const stock = await prisma.stock.findUnique({
      where: { productId_flavor: { productId, flavor } },
    });

    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ error: 'Produto sem estoque disponível' });
    }

    // Buscar ou criar carrinho
    let cart = null;

    if (req.userId) {
      cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: req.userId } });
      }
    } else if (sessionId) {
      cart = await prisma.cart.findUnique({ where: { sessionId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { sessionId } });
      }
    } else {
      return res.status(400).json({ error: 'Sessão inválida' });
    }

    // Verificar se item já existe
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId_flavor: { cartId: cart.id, productId, flavor } },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, flavor, quantity },
      });
    }

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    const formattedItems = updatedCart?.items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      image: JSON.parse(item.product.images)[0],
      flavor: item.flavor,
      quantity: item.quantity,
    })) || [];

    res.json({ items: formattedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
});

// Atualizar quantidade
router.patch('/items/:itemId', async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      // Verificar estoque
      const stock = await prisma.stock.findUnique({
        where: { productId_flavor: { productId: item.productId, flavor: item.flavor } },
      });

      if (!stock || stock.quantity < quantity) {
        return res.status(400).json({ error: 'Quantidade indisponível' });
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

// Remover item
router.delete('/items/:itemId', async (req: Request, res: Response) => {
  const { itemId } = req.params;

  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover item' });
  }
});

export default router;
