# Deploy

## 1. Banco Supabase

O banco já usa PostgreSQL no Supabase. A variável necessária para o back-end é:

```env
DATABASE_URL="postgresql://postgres:SENHA@db.dmkyohnbmgmjcdsdqgyo.supabase.co:5432/postgres"
```

Não coloque essa variável no GitHub.

## 2. Back-end na Render

Crie um Web Service a partir do repositório `RENA01245/TRABALHO-PROTESTO22`.

Configuração:

```text
Root Directory: backend
Build Command: npm install --ignore-scripts && npm run build
Start Command: npm start
Health Check Path: /api/health
```

Variáveis:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="uma-frase-secreta-grande"
CORS_ORIGIN="http://localhost:5173,https://SEU-PROJETO.vercel.app"
NODE_ENV="production"
```

Depois do primeiro deploy, rode o seed no Shell da Render, se necessário:

```bash
npm run seed
```

## 3. Front-end na Vercel

Importe o mesmo repositório.

Configuração:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Variável:

```env
VITE_API_URL="https://SEU-BACKEND.onrender.com/api"
```

## 4. Ordem Recomendada

1. Publicar back-end na Render.
2. Copiar a URL da Render.
3. Configurar `VITE_API_URL` na Vercel.
4. Publicar front-end na Vercel.
5. Voltar na Render e ajustar `CORS_ORIGIN` com a URL final da Vercel.
6. Testar login:

```text
funcionario@demo.com / 123456
chefe@demo.com / 123456
admin@demo.com / 123456
```
