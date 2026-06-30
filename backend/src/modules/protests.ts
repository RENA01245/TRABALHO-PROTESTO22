import { Router } from "express";
import multer from "multer";
import { PaymentStatus, ProtestStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { parseDate } from "../utils/validators.js";

export const protestsRouter = Router();
const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } });

protestsRouter.get("/", authenticate, async (req, res, next) => {
  try {
    const query = z.object({
      protocol: z.string().optional(),
      debtor: z.string().optional(),
      document: z.string().optional(),
      status: z.nativeEnum(ProtestStatus).optional(),
      date: z.string().optional()
    }).parse(req.query);

    const date = parseDate(query.date);
    const protests = await prisma.protest.findMany({
      where: {
        protocol: query.protocol ? { contains: query.protocol, mode: "insensitive" } : undefined,
        protestStatus: query.status,
        dueDate: date ? { gte: date, lt: new Date(date.getTime() + 86400000) } : undefined,
        debtor: {
          name: query.debtor ? { contains: query.debtor, mode: "insensitive" } : undefined,
          document: query.document ? { contains: query.document } : undefined
        }
      },
      include: { debtor: true, creditor: true, attachments: true, boletoPaidBy: { select: { name: true } } },
      orderBy: { updatedAt: "desc" }
    });

    return res.json(protests);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.get("/:id", authenticate, async (req, res) => {
  const id = String(req.params.id);
  const protest = await prisma.protest.findUnique({
    where: { id },
    include: {
      debtor: true,
      creditor: true,
      attachments: true,
      histories: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: "desc" } },
      paymentInfo: true,
      boletoPaidBy: { select: { name: true } }
    }
  });

  if (!protest) return res.status(404).json({ message: "Protesto não encontrado." });
  return res.json(protest);
});

protestsRouter.patch("/:id/status", authenticate, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const body = z.object({ status: z.nativeEnum(ProtestStatus) }).parse(req.body);
    const current = await prisma.protest.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ message: "Protesto não encontrado." });

    const updated = await prisma.protest.update({
      where: { id },
      data: {
        protestStatus: body.status,
        histories: {
          create: {
            userId: req.user!.id,
            action: "ALTERACAO_STATUS",
            fromStatus: current.protestStatus,
            toStatus: body.status,
            description: `Status alterado de ${current.protestStatus} para ${body.status}.`
          }
        }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.post("/:id/client-payment", authenticate, authorize([UserRole.FUNCIONARIO, UserRole.ADMIN]), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const body = z.object({ paymentDate: z.string(), amount: z.number().positive() }).parse(req.body);
    const paymentDate = parseDate(body.paymentDate);
    if (!paymentDate) return res.status(400).json({ message: "Data inválida." });

    const updated = await prisma.protest.update({
      where: { id },
      data: {
        clientPaid: true,
        clientPaymentDate: paymentDate,
        clientPaymentAmount: body.amount,
        protestStatus: ProtestStatus.CLIENTE_PAGOU,
        paymentStatus: PaymentStatus.CLIENTE_PAGOU,
        paymentInfo: {
          upsert: {
            create: { clientPaymentDate: paymentDate, clientPaymentAmount: body.amount },
            update: { clientPaymentDate: paymentDate, clientPaymentAmount: body.amount }
          }
        },
        histories: {
          create: {
            userId: req.user!.id,
            action: "CLIENTE_PAGOU",
            toStatus: ProtestStatus.CLIENTE_PAGOU,
            description: `Cliente pagou R$ ${body.amount.toFixed(2)} em ${body.paymentDate}.`
          }
        }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.post("/:id/boleto", authenticate, authorize([UserRole.FUNCIONARIO, UserRole.ADMIN]), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const body = z.object({ boletoDueDate: z.string(), boletoAmount: z.number().positive() }).parse(req.body);
    const boletoDueDate = parseDate(body.boletoDueDate);
    if (!boletoDueDate) return res.status(400).json({ message: "Data de vencimento inválida." });

    const updated = await prisma.protest.update({
      where: { id },
      data: {
        boletoRequired: true,
        boletoDueDate,
        boletoAmount: body.boletoAmount,
        protestStatus: ProtestStatus.BOLETO_ENVIADO_AO_CHEFE,
        paymentStatus: PaymentStatus.AGUARDANDO_PAGAMENTO_DO_BOLETO,
        paymentInfo: {
          upsert: {
            create: { boletoDueDate, boletoAmount: body.boletoAmount },
            update: { boletoDueDate, boletoAmount: body.boletoAmount }
          }
        },
        histories: {
          create: {
            userId: req.user!.id,
            action: "BOLETO_INFORMADO",
            toStatus: ProtestStatus.BOLETO_ENVIADO_AO_CHEFE,
            description: `Boleto informado no valor de R$ ${body.boletoAmount.toFixed(2)}.`
          }
        }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.post("/:id/attachments", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    if (!req.file) return res.status(400).json({ message: "Arquivo não informado." });
    const attachment = await prisma.protestAttachment.create({
      data: {
        protestId: id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        path: req.file.path,
        createdById: req.user!.id
      }
    });

    await prisma.protest.update({
      where: { id },
      data: {
        boletoUploaded: true,
        histories: {
          create: {
            userId: req.user!.id,
            action: "ANEXO_BOLETO",
            description: `Anexo enviado: ${req.file.originalname}.`
          }
        }
      }
    });

    return res.status(201).json(attachment);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.post("/:id/boleto-paid", authenticate, authorize([UserRole.CHEFE, UserRole.ADMIN]), async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const paidAt = new Date();
    const updated = await prisma.protest.update({
      where: { id },
      data: {
        boletoPaid: true,
        boletoPaidAt: paidAt,
        boletoPaidById: req.user!.id,
        protestStatus: ProtestStatus.BOLETO_PAGO,
        paymentStatus: PaymentStatus.BOLETO_PAGO,
        paymentInfo: { upsert: { create: { boletoPaidAt: paidAt }, update: { boletoPaidAt: paidAt } } },
        histories: {
          create: {
            userId: req.user!.id,
            action: "BOLETO_PAGO",
            toStatus: ProtestStatus.BOLETO_PAGO,
            description: "Boleto marcado como pago pelo chefe."
          }
        }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.post("/:id/notes", authenticate, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const body = z.object({ notes: z.string().min(1) }).parse(req.body);
    const updated = await prisma.protest.update({
      where: { id },
      data: {
        notes: body.notes,
        histories: { create: { userId: req.user!.id, action: "OBSERVACAO", description: "Observação atualizada." } }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

protestsRouter.get("/:id/history", authenticate, async (req, res) => {
  const id = String(req.params.id);
  const history = await prisma.protestHistory.findMany({
    where: { protestId: id },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { createdAt: "desc" }
  });
  return res.json(history);
});
