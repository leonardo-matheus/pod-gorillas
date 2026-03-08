import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  abacatePay: {
    apiKey: process.env.ABACATEPAY_API_KEY || '',
    webhookSecret: process.env.ABACATEPAY_WEBHOOK_SECRET || '',
    baseUrl: 'https://api.abacatepay.com/v1',
  },

  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
    webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET || '',
  },
};
