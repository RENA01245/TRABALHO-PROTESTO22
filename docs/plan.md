# Plan - Plano Técnico

## 1. Arquitetura

O projeto será uma aplicação web em monorepo com:

- `backend`: API REST em Node.js, Express e TypeScript.
- `frontend`: SPA em React, Vite e TypeScript.
- `docs`: documentação SDD e Spec Kit.

O back-end centraliza autenticação, autorização, validação, regras de negócio, importação, histórico e persistência no PostgreSQL via Prisma.

O front-end apresenta um painel administrativo responsivo com menu lateral, dashboard, importação, listagem, detalhes, boletos pendentes e relatório simples.

## 2. Tecnologias

- React
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form
- Zod
- Node.js
- Express
- Prisma
- PostgreSQL
- Supabase
- JWT
- Bcrypt
- Multer

## 3. Organização das Camadas

Back-end:

```text
src/
  config/
  middlewares/
  modules/
  routes/
  utils/
  server.ts
```

Front-end:

```text
src/
  api/
  components/
  hooks/
  layouts/
  pages/
  routes/
  styles/
  types/
```

## 4. API REST

Rotas principais:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `POST /api/imports/protests`
- `GET /api/imports/:id/errors`
- `GET /api/protests`
- `GET /api/protests/:id`
- `PATCH /api/protests/:id/status`
- `POST /api/protests/:id/client-payment`
- `POST /api/protests/:id/boleto`
- `POST /api/protests/:id/attachments`
- `POST /api/protests/:id/boleto-paid`
- `POST /api/protests/:id/notes`
- `GET /api/protests/:id/history`
- `GET /api/boletos/pending`
- `GET /api/reports/summary`
- `GET /api/reports/export.csv`
- `GET /api/users`
- `POST /api/users`

## 5. Banco de Dados

O banco será PostgreSQL no Supabase. O Prisma será usado para:

- modelagem do schema;
- migrations;
- seed de usuários iniciais;
- queries da aplicação.

Usuários iniciais para apresentação:

- `funcionario@demo.com`
- `chefe@demo.com`
- `admin@demo.com`

Senha padrão local: `123456`.

## 6. Autenticação e Autorização

- Login com e-mail e senha.
- Senha comparada com Bcrypt.
- JWT assinado com `JWT_SECRET`.
- Middleware de autenticação em rotas protegidas.
- Middleware de autorização por perfil.

## 7. Segurança

- Não versionar `.env`.
- Validar payloads com Zod.
- Validar upload com Multer.
- Limitar tamanho de arquivo.
- Retornar erros claros sem expor stack trace em produção.

## 8. Upload de Arquivos

Na primeira versão, anexos podem ser salvos localmente no back-end em `uploads/`. Em produção, a política definitiva pode migrar para Supabase Storage: **(A DEFINIR)**.

## 9. Dashboard

Indicadores:

- total de protestos;
- clientes que pagaram;
- boletos pendentes para o chefe;
- boletos pagos;
- protestos pendentes;
- protestados;
- cancelados;
- importados hoje.

O indicador mais destacado é boletos pendentes para pagamento.

## 10. Relatórios

Relatório simples com:

- protestos por status;
- boletos pendentes;
- boletos pagos;
- clientes que pagaram;
- protestos protestados.

Exportação inicial em CSV.

## 11. Deploy

- Front-end na Vercel.
- Back-end na Render.
- Banco no Supabase.

Variáveis necessárias:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `CORS_ORIGIN`
- `VITE_API_URL`

## 12. Testes

Testes manuais obrigatórios:

1. Login como funcionário.
2. Importação CSV.
3. Listagem de protestos.
4. Marcação de cliente pago.
5. Informação de boleto.
6. Login como chefe.
7. Boletos pendentes.
8. Marcação de boleto pago.
9. Histórico.
10. Dashboard atualizado.

## 13. Riscos

- Layout real de arquivo ainda indefinido.
- Configuração externa do Supabase depende de credenciais.
- Deploy depende das variáveis corretas na Vercel e Render.
- Anexos locais não são ideais para produção em Render; Supabase Storage é recomendável futuramente.

## 14. Cronograma

- Dia 1: documentação Spec Kit e scaffold.
- Dia 2: back-end, Prisma, autenticação e seed.
- Dia 3: importação, protestos, boletos e histórico.
- Dia 4: front-end, dashboard e telas principais.
- Dia 5: testes, ajustes visuais, README e deploy.

## 15. Estratégia de Implementação

1. Criar documentação obrigatória.
2. Criar estrutura do monorepo.
3. Implementar Prisma schema e seed.
4. Implementar API REST com autenticação.
5. Implementar fluxo de protestos e boletos.
6. Implementar front-end administrativo.
7. Validar fluxo principal.
8. Preparar deploy.
