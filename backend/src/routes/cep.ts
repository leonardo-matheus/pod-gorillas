import { Router, Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../index';

const router = Router();

// Consultar CEP via ViaCEP
router.get('/:cep', async (req: Request, res: Response) => {
  const { cep } = req.params;
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido' });
  }

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = response.data;

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }

    // Buscar configurações para verificar cidade de entrega
    const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
    const deliveryCity = settings?.deliveryCity?.toLowerCase() || 'matão';
    const isDeliveryAvailable = data.localidade.toLowerCase() === deliveryCity;

    res.json({
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      isDeliveryAvailable,
      deliveryFee: isDeliveryAvailable ? (settings?.deliveryFee || 10) : 0,
      deliveryMessage: isDeliveryAvailable
        ? `Entrega disponível em ${data.localidade} por R$ ${settings?.deliveryFee?.toFixed(2).replace('.', ',') || '10,00'}`
        : `Entrega não disponível em ${data.localidade}. Retirada em mãos grátis.`,
    });
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    res.status(500).json({ error: 'Erro ao consultar CEP' });
  }
});

export default router;
