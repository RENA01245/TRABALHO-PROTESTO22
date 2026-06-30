import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { authenticate } from "../middlewares/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.active) return res.status(401).json({ message: "Credenciais inválidas." });

    const passwordOk = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordOk) return res.status(401).json({ message: "Credenciais inválidas." });

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: "8h"
    });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true }
  });
  return res.json(user);
});
