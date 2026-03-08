import { Router, Request, Response } from 'express';
import { config } from '../config';
import { whatsappService } from '../services/whatsapp';

const router = Router();

// Verificação do webhook (GET)
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    console.log('WhatsApp webhook verificado');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receber mensagens (POST)
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    const message = messages[0];
    const from = message.from; // Número do remetente

    let text = '';

    // Extrair texto da mensagem
    if (message.type === 'text') {
      text = message.text.body;
    } else if (message.type === 'interactive') {
      if (message.interactive.type === 'button_reply') {
        text = message.interactive.button_reply.id;
      } else if (message.interactive.type === 'list_reply') {
        text = message.interactive.list_reply.id;
      }
    }

    if (text) {
      const response = await whatsappService.processMessage(from, text);
      await whatsappService.sendMessage(from, response);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

export default router;
