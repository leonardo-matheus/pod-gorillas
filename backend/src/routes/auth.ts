import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { config } from '../config';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// Registro completo (com cashback)
router.post(
  '/register',
  [
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('lgpdAccepted').equals('true').withMessage('Você deve aceitar a política de privacidade'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, phone } = req.body;
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      const existingUser = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (existingUser) {
        return res.status(400).json({ error: 'Telefone já cadastrado' });
      }

      if (email) {
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email: email || null,
          password: hashedPassword,
          name,
          phone: cleanPhone,
          lgpdAccepted: true,
        },
      });

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, cashback: user.cashback },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, password } = req.body;
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      const user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: '30d' }
      );

      res.json({
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, cashback: user.cashback },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

// Perfil
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, phone: true, role: true, cashback: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

export default router;
