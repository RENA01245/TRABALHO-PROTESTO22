# Quickstart: Sistema de Controle de Protestos

## 1. Install

```bash
npm install --workspaces --ignore-scripts
```

## 2. Configure Back-end

Create `backend/.env` from `backend/.env.example`.

Required variables:

```env
DATABASE_URL="postgresql://postgres:password@host:5432/postgres"
JWT_SECRET="troque-este-segredo"
PORT=3333
CORS_ORIGIN="http://localhost:5173"
```

## 3. Configure Front-end

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL="http://localhost:3333/api"
```

## 4. Database

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run seed --workspace backend
```

## 5. Run

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

## 6. Demo Users

All demo users use password `123456`.

- funcionario@demo.com
- chefe@demo.com
- admin@demo.com

## 7. Acceptance Flow

1. Login as funcionário.
2. Import `backend/sample-protestos.csv`.
3. Open a protest.
4. Mark client as paid.
5. Inform boleto.
6. Login as chefe.
7. Open pending boletos.
8. Mark boleto as paid.
9. Check dashboard and history.
