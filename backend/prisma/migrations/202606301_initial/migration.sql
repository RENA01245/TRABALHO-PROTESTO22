-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FUNCIONARIO', 'CHEFE', 'ADMIN');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PROCESSADO', 'COM_ERROS');

-- CreateEnum
CREATE TYPE "ProtestStatus" AS ENUM ('IMPORTADO', 'EM_ANALISE', 'AGUARDANDO_CLIENTE', 'CLIENTE_PAGOU', 'BOLETO_PENDENTE', 'BOLETO_ENVIADO_AO_CHEFE', 'BOLETO_PAGO', 'PENDENTE', 'PROTESTADO', 'CANCELADO', 'DEVOLVIDO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NAO_PAGO', 'CLIENTE_PAGOU', 'AGUARDANDO_PAGAMENTO_DO_BOLETO', 'BOLETO_PAGO', 'PENDENTE_CONFIRMACAO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "importedRows" INTEGER NOT NULL,
    "errorRows" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportError" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debtor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creditor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Creditor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protest" (
    "id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "titleNumber" TEXT NOT NULL,
    "debtorId" TEXT NOT NULL,
    "creditorId" TEXT,
    "importBatchId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "presentationDate" TIMESTAMP(3),
    "protestStatus" "ProtestStatus" NOT NULL DEFAULT 'IMPORTADO',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NAO_PAGO',
    "clientPaid" BOOLEAN NOT NULL DEFAULT false,
    "clientPaymentDate" TIMESTAMP(3),
    "clientPaymentAmount" DECIMAL(12,2),
    "boletoRequired" BOOLEAN NOT NULL DEFAULT false,
    "boletoUploaded" BOOLEAN NOT NULL DEFAULT false,
    "boletoDueDate" TIMESTAMP(3),
    "boletoAmount" DECIMAL(12,2),
    "boletoPaid" BOOLEAN NOT NULL DEFAULT false,
    "boletoPaidAt" TIMESTAMP(3),
    "boletoPaidById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Protest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtestAttachment" (
    "id" TEXT NOT NULL,
    "protestId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProtestAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtestHistory" (
    "id" TEXT NOT NULL,
    "protestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProtestHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentInfo" (
    "id" TEXT NOT NULL,
    "protestId" TEXT NOT NULL,
    "clientPaymentDate" TIMESTAMP(3),
    "clientPaymentAmount" DECIMAL(12,2),
    "boletoDueDate" TIMESTAMP(3),
    "boletoAmount" DECIMAL(12,2),
    "boletoPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Debtor_document_documentType_key" ON "Debtor"("document", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "Creditor_document_documentType_key" ON "Creditor"("document", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "Protest_protocol_key" ON "Protest"("protocol");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_protestId_key" ON "PaymentInfo"("protestId");

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportError" ADD CONSTRAINT "ImportError_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "Creditor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_boletoPaidById_fkey" FOREIGN KEY ("boletoPaidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtestAttachment" ADD CONSTRAINT "ProtestAttachment_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtestAttachment" ADD CONSTRAINT "ProtestAttachment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtestHistory" ADD CONSTRAINT "ProtestHistory_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtestHistory" ADD CONSTRAINT "ProtestHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInfo" ADD CONSTRAINT "PaymentInfo_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
