import { Router } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const boletosRouter = Router();

boletosRouter.get("/pending", authenticate, authorize([UserRole.CHEFE, UserRole.ADMIN]), async (_req, res) => {
  const protests = await prisma.protest.findMany({
    where: { clientPaid: true, boletoRequired: true, boletoPaid: false },
    include: { debtor: true, creditor: true, attachments: true },
    orderBy: { boletoDueDate: "asc" }
  });

  return res.json(protests);
});
