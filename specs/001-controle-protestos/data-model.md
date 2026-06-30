# Data Model: Sistema de Controle de Protestos

## User

- id: unique identifier
- name: display name
- email: unique login e-mail
- passwordHash: Bcrypt hash
- role: FUNCIONARIO, CHEFE or ADMIN
- active: access flag
- createdAt, updatedAt

Relationships:

- creates many ImportBatch records
- creates many ProtestHistory records
- uploads many ProtestAttachment records

## ImportBatch

- id
- filename
- status: PROCESSADO or COM_ERROS
- totalRows
- importedRows
- errorRows
- createdById
- createdAt

Relationships:

- belongs to User
- has many ImportError records
- has many Protest records

## ImportError

- id
- importBatchId
- rowNumber
- message
- rawData
- createdAt

## Debtor

- id
- name
- document
- documentType: CPF or CNPJ
- createdAt, updatedAt

Relationships:

- has many Protest records

## Creditor

- id
- name
- document
- documentType: CPF or CNPJ
- createdAt, updatedAt

Relationships:

- has many Protest records

## Protest

- id
- protocol
- titleNumber
- debtorId
- creditorId
- importBatchId
- amount
- dueDate
- presentationDate
- protestStatus
- paymentStatus
- clientPaid
- clientPaymentDate
- clientPaymentAmount
- boletoRequired
- boletoUploaded
- boletoDueDate
- boletoAmount
- boletoPaid
- boletoPaidAt
- boletoPaidById
- notes
- createdAt, updatedAt

Validation rules:

- protocol must be unique
- amount cannot be negative
- dates must be valid
- document must be valid CPF/CNPJ when informed

## ProtestAttachment

- id
- protestId
- filename
- originalName
- mimeType
- path
- createdById
- createdAt

## ProtestHistory

- id
- protestId
- userId
- action
- fromStatus
- toStatus
- description
- createdAt

## PaymentInfo

- id
- protestId
- clientPaymentDate
- clientPaymentAmount
- boletoDueDate
- boletoAmount
- boletoPaidAt
- createdAt, updatedAt
