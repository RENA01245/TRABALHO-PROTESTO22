import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middlewares/auth.js";

export const reportsRouter = Router();

reportsRouter.get("/summary", authenticate, async (_req, res) => {
  const byStatus = await prisma.protest.groupBy({ by: ["protestStatus"], _count: { _all: true } });
  const [pendingBoletos, paidBoletos, clientPaid, protested] = await Promise.all([
    prisma.protest.count({ where: { clientPaid: true, boletoRequired: true, boletoPaid: false } }),
    prisma.protest.count({ where: { boletoPaid: true } }),
    prisma.protest.count({ where: { clientPaid: true } }),
    prisma.protest.count({ where: { protestStatus: "PROTESTADO" } })
  ]);

  return res.json({ byStatus, pendingBoletos, paidBoletos, clientPaid, protested });
});

reportsRouter.get("/export.csv", authenticate, async (_req, res) => {
  const protests = await prisma.protest.findMany({ include: { debtor: true } });
  const header = ["protocolo", "numero_titulo", "devedor", "documento", "valor", "status_protesto", "status_pagamento", "boleto_pago"];
  const lines = protests.map((item) => [
    item.protocol,
    item.titleNumber,
    item.debtor.name,
    item.debtor.document,
    item.amount.toString(),
    item.protestStatus,
    item.paymentStatus,
    item.boletoPaid ? "sim" : "nao"
  ].join(","));

  res.header("Content-Type", "text/csv");
  res.attachment("relatorio-protestos.csv");
  return res.send([header.join(","), ...lines].join("\n"));
});
