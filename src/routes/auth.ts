import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { LoginBody } from '../types/index.js';

const router = express.Router();

router.post(
  '/login',
  async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        res.status(500).json({ error: 'Server configuration error' });
        return;
      }

      const token = jwt.sign({ email, role: 'admin' }, secret, {
        expiresIn: '7d',
      });

      res.json({
        message: 'Login successful',
        token,
        email,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export default router;