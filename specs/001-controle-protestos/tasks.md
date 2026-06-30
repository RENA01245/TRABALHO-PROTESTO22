# Tasks: Sistema de Controle de Protestos e Repasse de Pagamentos

**Input**: Design documents from `/specs/001-controle-protestos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Build checks and manual acceptance flow.

**Organization**: Tasks are grouped by user story to allow independent validation.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create official Spec Kit structure in `.specify/`
- [x] T002 Create feature directory `specs/001-controle-protestos/`
- [x] T003 [P] Create academic docs in `docs/`
- [x] T004 [P] Create monorepo package setup in `package.json`
- [x] T005 [P] Create `.gitignore` and environment examples

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T006 Configure backend TypeScript project in `backend/`
- [x] T007 Configure frontend Vite React TypeScript project in `frontend/`
- [x] T008 Create Prisma schema in `backend/prisma/schema.prisma`
- [x] T009 Create initial migration in `backend/prisma/migrations/202606301_initial/migration.sql`
- [x] T010 Create seed users in `backend/prisma/seed.ts`
- [x] T011 Implement JWT authentication middleware in `backend/src/middlewares/auth.ts`
- [x] T012 Implement API route registration in `backend/src/routes/index.ts`
- [x] T013 Implement frontend API client in `frontend/src/api/client.ts`

## Phase 3: User Story 1 - Funcionário registra pagamento e boleto (Priority: P1) MVP

**Goal**: Funcionário imports protests, marks client payment and sends boleto to chefe.

**Independent Test**: Login as funcionário, import CSV, open protest, mark client paid, inform boleto and confirm it becomes pending.

- [x] T014 [US1] Implement CSV parser in `backend/src/utils/csv.ts`
- [x] T015 [US1] Implement CPF/CNPJ/date validation in `backend/src/utils/validators.ts`
- [x] T016 [US1] Implement import endpoint in `backend/src/modules/imports.ts`
- [x] T017 [US1] Implement protests list and detail endpoints in `backend/src/modules/protests.ts`
- [x] T018 [US1] Implement client payment endpoint in `backend/src/modules/protests.ts`
- [x] T019 [US1] Implement boleto information endpoint in `backend/src/modules/protests.ts`
- [x] T020 [US1] Implement upload attachment endpoint in `backend/src/modules/protests.ts`
- [x] T021 [US1] Implement Import page in `frontend/src/pages/ImportPage.tsx`
- [x] T022 [US1] Implement Protest list page in `frontend/src/pages/ProtestsPage.tsx`
- [x] T023 [US1] Implement Protest details actions in `frontend/src/pages/ProtestDetailsPage.tsx`

## Phase 4: User Story 2 - Chefe visualiza e paga boletos pendentes (Priority: P2)

**Goal**: Chefe sees only pending boletos and marks them as paid.

**Independent Test**: Login as chefe, open pending boletos, mark item as paid and confirm it leaves pending list.

- [x] T024 [US2] Implement pending boletos endpoint in `backend/src/modules/boletos.ts`
- [x] T025 [US2] Implement boleto paid endpoint in `backend/src/modules/protests.ts`
- [x] T026 [US2] Implement pending boletos page in `frontend/src/pages/PendingBoletosPage.tsx`
- [x] T027 [US2] Enforce chefe/admin authorization on boleto payment routes

## Phase 5: User Story 3 - Dashboard and history (Priority: P3)

**Goal**: User sees indicators and history of actions.

**Independent Test**: Execute a payment flow and confirm dashboard counters and history update.

- [x] T028 [US3] Implement dashboard endpoint in `backend/src/modules/dashboard.ts`
- [x] T029 [US3] Implement history creation on important actions
- [x] T030 [US3] Implement dashboard page in `frontend/src/pages/DashboardPage.tsx`
- [x] T031 [US3] Show history in protest details page

## Phase 6: User Story 4 - Administrador gerencia usuários (Priority: P4)

**Goal**: Admin can create and list users.

**Independent Test**: Login as admin and call user management endpoints.

- [x] T032 [US4] Implement users endpoints in `backend/src/modules/users.ts`
- [x] T033 [US4] Restrict users endpoints to ADMIN

## Phase 7: Reporting, Site Demo and Polish

- [x] T034 Implement summary report and CSV export in `backend/src/modules/reports.ts`
- [x] T035 Implement report page in `frontend/src/pages/ReportPage.tsx`
- [x] T036 Implement responsive administrative layout in `frontend/src/styles.css`
- [x] T037 Implement site demo fallback in `frontend/src/api/mock.ts`
- [x] T038 Update README with setup, Supabase, Render and Vercel instructions
- [x] T039 Run `npm run build` successfully

## Dependencies & Execution Order

- Phase 1 before all work.
- Phase 2 blocks all user stories.
- US1 is MVP and must be validated before US2.
- US2 depends on boleto data from US1.
- US3 can be validated after US1 or US2 actions.
- US4 is independent after authentication exists.

## Implementation Strategy

1. Deliver official Spec Kit documentation.
2. Validate MVP flow in demo mode.
3. Configure Supabase and run Prisma migrations.
4. Deploy backend to Render.
5. Deploy frontend to Vercel.
6. Update README with final public links.
