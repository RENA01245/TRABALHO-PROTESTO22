# Sistema de Controle de Protestos e Repasse de Pagamentos

Aplicação acadêmica criada com metodologia SDD - Spec-Driven Development e fluxo Spec Kit.

O sistema resolve um problema real de controle interno: quando um cliente paga, o funcionário registra o pagamento, informa ou anexa o boleto correspondente, e o chefe visualiza os boletos pendentes para pagamento.

## Links

- Repositório GitHub: https://github.com/RENA01245/TRABALHO-PROTESTO22
- Sistema publicado: **(A DEFINIR)**
- Back-end publicado: **(A DEFINIR)**

## Metodologia SDD

O projeto segue as etapas:

1. Constitution
2. Specify
3. Plan
4. Tasks
5. Implement

Documentos obrigatórios:

- `.specify/memory/constitution.md`
- `specs/001-controle-protestos/spec.md`
- `specs/001-controle-protestos/plan.md`
- `specs/001-controle-protestos/tasks.md`
- `docs/constitution.md`
- `docs/schema.md`
- `docs/plan.md`
- `docs/tasks.md`

A pasta `.specify/` e a feature `specs/001-controle-protestos/` foram criadas com o GitHub Spec Kit.

## Tecnologias

Front-end:

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS responsivo

Back-end:

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT
- Bcrypt
- Multer
- Zod

Banco e deploy:

- PostgreSQL no Supabase
- Front-end na Vercel
- Back-end na Render

## Estrutura

```text
backend/
frontend/
docs/
README.md
.gitignore
```

## Funcionalidades

- Login com JWT.
- Controle de perfil: funcionário, chefe e administrador.
- Importação de protestos por CSV.
- Validação de arquivo importado.
- Listagem e filtros de protestos.
- Detalhes do protesto.
- Registro de pagamento do cliente.
- Informação e anexo de boleto.
- Tela de boletos pendentes para o chefe.
- Marcação de boleto como pago.
- Histórico de alterações.
- Dashboard com indicadores.
- Relatório simples e exportação CSV.

## Como Rodar Localmente

Instale as dependências:

```bash
npm install --workspaces --ignore-scripts
```

Configure o back-end:

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:senha@host:5432/postgres"
JWT_SECRET="troque-este-segredo"
PORT=3333
CORS_ORIGIN="http://localhost:5173"
```

Configure o front-end:

```bash
cd frontend
cp .env.example .env
```

Edite `frontend/.env`:

```env
VITE_API_URL="http://localhost:3333/api"
```

Gere o Prisma Client:

```bash
npm run prisma:generate --workspace backend
```

Crie as tabelas:

```bash
npm run prisma:migrate --workspace backend
```

Crie usuários demo:

```bash
npm run seed --workspace backend
```

Execute o back-end:

```bash
npm run dev --workspace backend
```

Execute o front-end:

```bash
npm run dev --workspace frontend
```

## Usuários Demo

Todos usam a senha `123456`.

- Funcionário: `funcionario@demo.com`
- Chefe: `chefe@demo.com`
- Administrador: `admin@demo.com`

## Modelo CSV

Arquivo de exemplo:

```text
backend/sample-protestos.csv
```

Campos:

```csv
protocolo,numero_titulo,nome_devedor,documento_devedor,tipo_documento_devedor,nome_credor,documento_credor,tipo_documento_credor,valor,data_vencimento,data_apresentacao,status
```

## Configuração do Supabase

1. Criar projeto no Supabase.
2. Copiar a connection string PostgreSQL.
3. Configurar `DATABASE_URL` no arquivo `.env` e na Render.
4. Rodar migrations pelo Prisma.
5. Rodar seed para criar usuários demo.

## Deploy

Front-end na Vercel:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variável: `VITE_API_URL`

Back-end na Render:

- Root directory: `backend`
- Build command: `npm install --ignore-scripts && npm run prisma:generate && npm run build`
- Start command: `npm start`
- Variáveis: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`

## Fluxo Principal de Aceite

1. Funcionário faz login.
2. Funcionário importa arquivo de protestos.
3. Sistema mostra protestos importados.
4. Funcionário abre um protesto.
5. Funcionário marca que o cliente pagou.
6. Funcionário anexa ou informa boleto.
7. Sistema coloca o item em boletos pendentes.
8. Chefe faz login.
9. Chefe acessa boletos pendentes.
10. Chefe marca boleto como pago.
11. Sistema atualiza status.
12. Sistema registra histórico.
13. Dashboard atualiza indicadores.

## Prints

- Tela de login: **(A DEFINIR)**
- Dashboard: **(A DEFINIR)**
- Importação: **(A DEFINIR)**
- Boletos pendentes: **(A DEFINIR)**
