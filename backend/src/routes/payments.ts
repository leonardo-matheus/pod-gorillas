import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { abacatePayService } from '../services/abacatepay';

const router = Router();

// Webhook AbacatePay
router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-abacatepay-signature'] as string;
  const payload = JSON.stringify(req.body);

  // Validar assinatura
  if (!abacatePayService.verifyWebhook(signature, payload)) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  const { event, data } = req.body;

  try {
    if (event === 'billing.paid') {
      const order = await prisma.order.findFirst({
        where: { paymentId: data.id },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'paid' },
        });
      }
    }

    if (event === 'billing.expired' || event === 'billing.cancelled') {
      const order = await prisma.order.findFirst({
        where: { paymentId: data.id },
      });

      if (order && order.status === 'pending') {
        // Restaurar estoque
        const items = await prisma.orderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of items) {
          await prisma.stock.update({
            where: {
              productId_size_color: {
                productId: item.productId,
                size: item.size,
                color: item.color,
              },
            },
            data: { quantity: { increment: item.quantity } },
          });
        }

        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'cancelled' },
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// Verificar status do pagamento
router.get('/status/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || !order.paymentId) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const payment = await abacatePayService.getPaymentStatus(order.paymentId);

    if (payment.status === 'PAID' && order.status === 'pending') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'paid' },
      });
    }

    res.json({ status: order.status, paymentStatus: payment.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
});

export default router;
