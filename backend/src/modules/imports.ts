import { Router } from "express";
import multer from "multer";
import { DocumentType, ImportStatus, PaymentStatus, Prisma, ProtestStatus, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { parseCsv } from "../utils/csv.js";
import { isValidDocument, onlyDigits, parseDate } from "../utils/validators.js";

export const importsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

importsRouter.post(
  "/protests",
  authenticate,
  authorize([UserRole.FUNCIONARIO, UserRole.ADMIN]),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: "Arquivo não informado." });

      const rows = parseCsv(req.file.buffer.toString("utf-8"));
      const errors: { rowNumber: number; message: string; rawData: Prisma.InputJsonValue }[] = [];
      let importedRows = 0;

      const batch = await prisma.importBatch.create({
        data: {
          filename: req.file.originalname,
          status: ImportStatus.PROCESSADO,
          totalRows: rows.length,
          importedRows: 0,
          errorRows: 0,
          createdById: req.user!.id
        }
      });

      for (const [index, row] of rows.entries()) {
        const rowNumber = index + 2;
        const amount = Number(row.valor);
        const dueDate = parseDate(row.data_vencimento);
        const presentationDate = parseDate(row.data_apresentacao);
        const debtorType = row.tipo_documento_devedor as DocumentType;
        const creditorType = row.tipo_documento_credor as DocumentType;
        const debtorDoc = onlyDigits(row.documento_devedor ?? "");
        const creditorDoc = onlyDigits(row.documento_credor ?? "");

        const message = validateRow(row, amount, dueDate, debtorType, debtorDoc, creditorType, creditorDoc);
        if (message) {
          errors.push({ rowNumber, message, rawData: row });
          continue;
        }

        if (!dueDate) {
          errors.push({ rowNumber, message: "Data de vencimento inválida.", rawData: row });
          continue;
        }

        const duplicate = await prisma.protest.findUnique({ where: { protocol: row.protocolo } });
        if (duplicate) {
          errors.push({ rowNumber, message: "Protocolo duplicado.", rawData: row });
          continue;
        }

        const debtor = await prisma.debtor.upsert({
          where: { document_documentType: { document: debtorDoc, documentType: debtorType } },
          update: { name: row.nome_devedor },
          create: { name: row.nome_devedor, document: debtorDoc, documentType: debtorType }
        });

        const creditor = await prisma.creditor.upsert({
          where: { document_documentType: { document: creditorDoc, documentType: creditorType } },
          update: { name: row.nome_credor },
          create: { name: row.nome_credor, document: creditorDoc, documentType: creditorType }
        });

        const status = (row.status as ProtestStatus) || ProtestStatus.IMPORTADO;
        await prisma.protest.create({
          data: {
            protocol: row.protocolo,
            titleNumber: row.numero_titulo,
            debtorId: debtor.id,
            creditorId: creditor.id,
            importBatchId: batch.id,
            amount,
            dueDate,
            presentationDate,
            protestStatus: status,
            paymentStatus: status === ProtestStatus.BOLETO_PENDENTE ? PaymentStatus.AGUARDANDO_PAGAMENTO_DO_BOLETO : PaymentStatus.NAO_PAGO,
            boletoRequired: status === ProtestStatus.BOLETO_PENDENTE,
            histories: {
              create: {
                userId: req.user!.id,
                action: "IMPORTACAO",
                toStatus: status,
                description: `Protesto importado pelo arquivo ${req.file.originalname}.`
              }
            }
          }
        });
        importedRows++;
      }

      await prisma.importError.createMany({ data: errors.map((error) => ({ ...error, importBatchId: batch.id })) });
      const updatedBatch = await prisma.importBatch.update({
        where: { id: batch.id },
        data: {
          importedRows,
          errorRows: errors.length,
          status: errors.length > 0 ? ImportStatus.COM_ERROS : ImportStatus.PROCESSADO
        },
        include: { errors: true }
      });

      return res.status(201).json(updatedBatch);
    } catch (error) {
      return next(error);
    }
  }
);

importsRouter.get("/:id/errors", authenticate, async (req, res) => {
  const errors = await prisma.importError.findMany({ where: { importBatchId: String(req.params.id) } });
  return res.json(errors);
});

function validateRow(
  row: Record<string, string>,
  amount: number,
  dueDate: Date | null,
  debtorType: DocumentType,
  debtorDoc: string,
  creditorType: DocumentType,
  creditorDoc: string
) {
  if (!row.protocolo || !row.numero_titulo || !row.nome_devedor || !row.documento_devedor) return "Campos obrigatórios ausentes.";
  if (!Number.isFinite(amount) || amount < 0) return "Valor inválido.";
  if (!dueDate) return "Data de vencimento inválida.";
  if (!["CPF", "CNPJ"].includes(debtorType)) return "Tipo de documento do devedor inválido.";
  if (!isValidDocument(debtorDoc, debtorType)) return "Documento do devedor inválido.";
  if (creditorDoc && !["CPF", "CNPJ"].includes(creditorType)) return "Tipo de documento do credor inválido.";
  if (creditorDoc && !isValidDocument(creditorDoc, creditorType)) return "Documento do credor inválido.";
  return null;
}
