import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.abacatePay.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.abacatePay.apiKey}`,
    'Content-Type': 'application/json',
  },
});

interface CreatePixPaymentParams {
  amount: number; // em centavos
  description: string;
  externalId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument?: string;
}

interface PixPaymentResponse {
  id: string;
  status: string;
  amount: number;
  pixCode: string;
  qrCodeBase64: string;
  expiresAt: string;
}

export const abacatePayService = {
  async createPixPayment(params: CreatePixPaymentParams): Promise<PixPaymentResponse> {
    try {
      const response = await api.post('/billing/create', {
        methods: ['PIX'],
        products: [{
          externalId: params.externalId,
          name: params.description,
          quantity: 1,
          price: params.amount,
        }],
        returnUrl: `${config.frontendUrl}/pedido/confirmacao`,
        completionUrl: `${config.frontendUrl}/pedido/sucesso`,
        customer: {
          name: params.customerName,
          email: params.customerEmail,
          cellphone: params.customerPhone,
          taxId: params.customerDocument,
        },
      });

      const data = response.data.data;

      return {
        id: data.id,
        status: data.status,
        amount: data.amount,
        pixCode: data.pix?.brcode || data.pixCode || '',
        qrCodeBase64: data.pix?.qrcode || data.qrCodeBase64 || '',
        expiresAt: data.expiresAt,
      };
    } catch (error: any) {
      console.error('Erro AbacatePay:', error.response?.data || error.message);
      throw new Error('Erro ao criar pagamento PIX');
    }
  },

  async getPaymentStatus(paymentId: string): Promise<{ status: string; paidAt?: string }> {
    try {
      const response = await api.get(`/billing/get?id=${paymentId}`);
      const data = response.data.data;

      return {
        status: data.status,
        paidAt: data.paidAt,
      };
    } catch (error: any) {
      console.error('Erro ao consultar pagamento:', error.response?.data || error.message);
      throw new Error('Erro ao consultar status do pagamento');
    }
  },

  verifyWebhook(signature: string, payload: string): boolean {
    // AbacatePay usa HMAC SHA256 para validar webhooks
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', config.abacatePay.webhookSecret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  },
};
