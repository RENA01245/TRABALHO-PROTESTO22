# Deploy na Vercel

Este projeto está preparado para subir **frontend e backend na Vercel**.

- Frontend: React/Vite em `frontend/`
- Backend: Express como função serverless em `api/index.ts`
- Banco: Supabase PostgreSQL

## Configuração na Vercel

Importe o repositório:

```text
RENA01245/TRABALHO-PROTESTO22
```

Use a raiz do repositório como projeto:

```text
Root Directory: ./
```

O arquivo `vercel.json` já define:

```text
Install Command: npm install --ignore-scripts
Build Command: npm run build
Output Directory: frontend/dist
API: /api/*
```

## Variáveis de ambiente na Vercel

Configure em **Settings > Environment Variables**:

```env
DATABASE_URL="postgresql://postgres:SENHA_CODIFICADA@db.dmkyohnbmgmjcdsdqgyo.supabase.co:5432/postgres"
JWT_SECRET="uma-frase-secreta-grande"
CORS_ORIGIN="http://localhost:5173,https://SEU-PROJETO.vercel.app"
```

`VITE_API_URL` não é obrigatório neste modelo, porque o frontend usa `/api` no mesmo domínio da Vercel.

## Rotas

- Site: `https://SEU-PROJETO.vercel.app`
- API health: `https://SEU-PROJETO.vercel.app/api/health`
- Login: `https://SEU-PROJETO.vercel.app/api/auth/login`

## Seed

O banco já foi migrado e populado localmente. Se precisar rodar seed novamente, faça localmente apontando para o Supabase:

```bash
npm run seed --workspace backend
```

## Usuários demo

```text
funcionario@demo.com / 123456
chefe@demo.com / 123456
admin@demo.com / 123456
```
