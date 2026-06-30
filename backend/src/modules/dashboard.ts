import { Router } from "express";
import { ProtestStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middlewares/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", authenticate, async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    total,
    clientPaid,
    pendingBoletos,
    paidBoletos,
    pending,
    protested,
    canceled,
    importedToday
  ] = await Promise.all([
    prisma.protest.count(),
    prisma.protest.count({ where: { clientPaid: true } }),
    prisma.protest.count({ where: { clientPaid: true, boletoRequired: true, boletoPaid: false } }),
    prisma.protest.count({ where: { boletoPaid: true } }),
    prisma.protest.count({ where: { protestStatus: ProtestStatus.PENDENTE } }),
    prisma.protest.count({ where: { protestStatus: ProtestStatus.PROTESTADO } }),
    prisma.protest.count({ where: { protestStatus: ProtestStatus.CANCELADO } }),
    prisma.protest.count({ where: { createdAt: { gte: startOfToday } } })
  ]);

  return res.json({ total, clientPaid, pendingBoletos, paidBoletos, pending, protested, canceled, importedToday });
});
