# Feature Specification: Sistema de Controle de Protestos e Repasse de Pagamentos

**Feature Branch**: `001-controle-protestos`

**Created**: 2026-06-30

**Status**: Draft

**Input**: User description: "Sistema de Controle de Protestos e Repasse de Pagamentos / Painel de Acompanhamento de Protestos e Boletos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Funcionário registra pagamento e boleto (Priority: P1)

Como funcionário, quero importar ou cadastrar protestos, abrir um protesto, marcar que o cliente pagou e informar o boleto que o chefe precisa pagar.

**Why this priority**: Este é o fluxo principal do problema real. Sem ele, o sistema não resolve a comunicação entre funcionário e chefe.

**Independent Test**: Entrar como funcionário, importar CSV, abrir um protesto, marcar cliente como pago, informar boleto e confirmar que o caso aparece como pendente para o chefe.

**Acceptance Scenarios**:

1. **Given** um funcionário autenticado e um CSV válido, **When** ele importa o arquivo, **Then** os protestos válidos aparecem na lista.
2. **Given** um protesto importado, **When** o funcionário registra data e valor pagos pelo cliente, **Then** o protesto fica com status `CLIENTE_PAGOU`.
3. **Given** um protesto com cliente pago, **When** o funcionário informa valor e vencimento do boleto, **Then** o protesto aparece em boletos pendentes para pagamento.

---

### User Story 2 - Chefe visualiza e paga boletos pendentes (Priority: P2)

Como chefe, quero visualizar apenas os boletos pendentes e marcar o boleto como pago.

**Why this priority**: O chefe precisa saber rapidamente o que pagar, sem procurar em listas manuais.

**Independent Test**: Entrar como chefe, abrir "Boletos Pendentes", visualizar um item gerado pelo funcionário e marcar como pago.

**Acceptance Scenarios**:

1. **Given** um boleto pendente para pagamento, **When** o chefe acessa a tela de boletos pendentes, **Then** o sistema lista somente casos com cliente pago e boleto ainda não pago.
2. **Given** um boleto pendente, **When** o chefe marca como pago, **Then** o status muda para `BOLETO_PAGO` e o item sai da lista de pendentes.

---

### User Story 3 - Dashboard e histórico para acompanhamento (Priority: P3)

Como usuário autenticado, quero ver indicadores e histórico para acompanhar casos que precisam de atenção.

**Why this priority**: Ajuda a apresentação acadêmica e reduz confusão no acompanhamento diário.

**Independent Test**: Acessar dashboard e detalhes de um protesto depois de executar ações importantes.

**Acceptance Scenarios**:

1. **Given** protestos com diferentes status, **When** o usuário abre o dashboard, **Then** os indicadores mostram totais por situação.
2. **Given** alterações em um protesto, **When** o usuário abre seus detalhes, **Then** o histórico mostra quem realizou cada ação e quando.

---

### User Story 4 - Administrador gerencia usuários (Priority: P4)

Como administrador, quero cadastrar usuários e visualizar todos os registros para corrigir informações quando necessário.

**Why this priority**: É necessário para controle de acesso, mas não é o fluxo principal de negócio.

**Independent Test**: Entrar como administrador e criar usuário com perfil válido.

**Acceptance Scenarios**:

1. **Given** administrador autenticado, **When** cadastra um usuário com nome, e-mail, senha e perfil, **Then** o usuário pode acessar o sistema.

### Edge Cases

- Arquivo importado sem colunas obrigatórias deve gerar erro de importação.
- Linha com protocolo duplicado deve ser rejeitada.
- Valor negativo deve ser rejeitado.
- Data inválida deve ser rejeitada.
- CPF ou CNPJ inválido, quando informado, deve ser rejeitado.
- Usuário sem perfil adequado deve receber acesso negado.
- Regras jurídicas específicas não informadas devem ser marcadas como **(A DEFINIR)** e não implementadas por suposição.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow login with e-mail and password.
- **FR-002**: System MUST control access by role: funcionário, chefe and administrador.
- **FR-003**: System MUST allow administrator to create users.
- **FR-004**: System MUST allow funcionário to import protest files.
- **FR-005**: System MUST validate imported files and display import errors.
- **FR-006**: System MUST register valid imported protest rows automatically.
- **FR-007**: System MUST list protests with filters for protocol, debtor name, document, status and date.
- **FR-008**: System MUST show protest details with debtor, creditor, amount, due date, status, notes, attachments and history.
- **FR-009**: System MUST allow funcionário to mark client payment with date and amount.
- **FR-010**: System MUST allow funcionário to inform boleto amount and due date.
- **FR-011**: System MUST allow boleto attachment linked to a protest.
- **FR-012**: System MUST show pending boletos only when client has paid, boleto is required and boleto is not paid.
- **FR-013**: System MUST allow chefe to mark boleto as paid.
- **FR-014**: System MUST register history for import, client payment, boleto information, boleto payment, status changes and notes.
- **FR-015**: System MUST show dashboard indicators for total protests, client payments, pending boletos, paid boletos, pending protests, protested protests, canceled protests and imports today.
- **FR-016**: System MUST generate a simple report and CSV export.
- **FR-017**: System MUST keep unknown official file layouts as **(A DEFINIR)** instead of inventing rules.

### Key Entities *(include if feature involves data)*

- **User**: Authenticated person with name, e-mail, password hash, active flag and role.
- **ImportBatch**: Import operation containing filename, totals, status and creator.
- **ImportError**: Validation error linked to an import batch and original row data.
- **Debtor**: Client/debtor with name, document and document type.
- **Creditor**: Creditor with name, document and document type.
- **Protest**: Main record with protocol, title number, debtor, creditor, amount, due date, status, client payment and boleto fields.
- **ProtestAttachment**: File linked to a protest.
- **ProtestHistory**: Audit trail describing actions, status changes, user and timestamp.
- **PaymentInfo**: Payment details for client payment and boleto payment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Funcionário completes the main flow from login to boleto pending in under 5 minutes during presentation.
- **SC-002**: Chefe can identify pending boletos immediately from the dashboard and pending boletos page.
- **SC-003**: Every important action creates a visible history entry in protest details.
- **SC-004**: A valid CSV with three rows imports successfully and appears in the protest list.
- **SC-005**: The repository contains official Spec Kit structure plus required academic documents.

## Assumptions

- Initial file format for testing is CSV.
- Real official file layout remains **(A DEFINIR)**.
- The system is an academic/simple internal control site, not a complete cartório system.
- Deploy target is front-end on Vercel, back-end on Render and PostgreSQL on Supabase.
- Demo mode may exist for visual presentation before production services are configured.
