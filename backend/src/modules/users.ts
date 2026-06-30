import { Router } from "express";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const usersRouter = Router();

usersRouter.use(authenticate, authorize([UserRole.ADMIN]));

usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    orderBy: { name: "asc" }
  });
  return res.json(users);
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const body = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.nativeEnum(UserRole)
    }).parse(req.body);

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, passwordHash, role: body.role },
      select: { id: true, name: true, email: true, role: true, active: true }
    });

    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
});
