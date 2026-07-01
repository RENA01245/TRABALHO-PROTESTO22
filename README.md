# Sistema de Controle de Protestos e Repasse de Pagamentos

Sistema web academico desenvolvido com **SDD - Spec-Driven Development** usando o fluxo **GitHub Spec Kit**.

O projeto resolve um problema real de controle interno: quando um cliente paga, o funcionario registra o pagamento, informa o boleto correspondente e o chefe visualiza quais boletos ainda precisam ser pagos.

## Links

- Repositorio GitHub: [RENA01245/TRABALHO-PROTESTO22](https://github.com/RENA01245/TRABALHO-PROTESTO22)
- Sistema publicado na Vercel: **adicione aqui o link final da Vercel**
- API: `/api`

## Objetivo

Permitir que funcionario, chefe e administrador acompanhem protestos, pagamentos de clientes, boletos pendentes e historico das alteracoes de forma simples, visual e adequada para apresentacao academica.

O foco principal do dashboard e destacar o que precisa de atencao, especialmente **boletos pendentes para pagamento do chefe**.

## Usuarios Demo

Todos usam a senha:

```text
123456
```

| Perfil | E-mail |
| --- | --- |
| Funcionario | `funcionario@demo.com` |
| Chefe | `chefe@demo.com` |
| Administrador | `admin@demo.com` |

## Principais Funcionalidades

- Login com JWT.
- Controle de acesso por perfil.
- Dashboard com indicadores.
- Destaque para boletos pendentes.
- Importacao de protestos por CSV.
- Listagem e filtros de protestos.
- Detalhes do protesto.
- Registro de pagamento do cliente.
- Informacao de boleto para o chefe.
- Marcacao de boleto como pago.
- Historico de alteracoes.
- Relatorio simples.
- Exportacao CSV.
- Modo demo visual quando a API nao estiver disponivel.

## Metodologia SDD e Spec Kit

O projeto segue as etapas:

1. Constitution
2. Specify
3. Plan
4. Tasks
5. Implement

Arquivos principais do Spec Kit:

```text
.specify/memory/constitution.md
specs/001-controle-protestos/spec.md
specs/001-controle-protestos/plan.md
specs/001-controle-protestos/tasks.md
specs/001-controle-protestos/research.md
specs/001-controle-protestos/data-model.md
specs/001-controle-protestos/quickstart.md
specs/001-controle-protestos/contracts/openapi.yaml
```

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS responsivo

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT
- Bcrypt
- Multer
- Zod

### Banco e Deploy

- PostgreSQL no Supabase
- Frontend e API na Vercel
- Prisma migrations
- Seed de usuarios demo

## Estrutura do Projeto

```text
api/
backend/
frontend/
scripts/
specs/
.specify/
DEPLOY.md
README.md
package.json
vercel.json
```

## Como Rodar Localmente

Instale as dependencias:

```bash
npm install --workspaces --ignore-scripts
```

Crie `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:SENHA@db.dmkyohnbmgmjcdsdqgyo.supabase.co:5432/postgres"
JWT_SECRET="uma-frase-secreta-grande"
PORT=3333
CORS_ORIGIN="http://localhost:5173"
```

Crie `frontend/.env` se quiser sobrescrever a API local:

```env
VITE_API_URL="http://localhost:3333/api"
```

Gere o Prisma Client:

```bash
npm run prisma:generate --workspace backend
```

Rode migrations:

```bash
npm run prisma:migrate --workspace backend
```

Crie usuarios demo:

```bash
npm run seed --workspace backend
```

Execute o backend:

```bash
npm run dev --workspace backend
```

Execute o frontend:

```bash
npm run dev --workspace frontend
```

## Modelo CSV

Arquivo de exemplo:

```text
backend/sample-protestos.csv
```

Campos:

```csv
protocolo,numero_titulo,nome_devedor,documento_devedor,tipo_documento_devedor,nome_credor,documento_credor,tipo_documento_credor,valor,data_vencimento,data_apresentacao,status
```

## Deploy na Vercel

O projeto esta preparado para publicar frontend e backend na Vercel.

Configuracao:

```text
Root Directory: ./
Build Command: npm run build
Output Directory: dist
```

Variaveis de ambiente na Vercel:

```env
DATABASE_URL="postgresql://postgres:SENHA_CODIFICADA@db.dmkyohnbmgmjcdsdqgyo.supabase.co:5432/postgres"
JWT_SECRET="uma-frase-secreta-grande"
CORS_ORIGIN="http://localhost:5173,https://SEU-PROJETO.vercel.app"
```

Nao e necessario configurar `VITE_API_URL` na Vercel, pois o frontend usa `/api` no mesmo dominio.

Mais detalhes em [DEPLOY.md](DEPLOY.md).

## Fluxo Principal de Aceite

1. Funcionario faz login.
2. Funcionario importa arquivo de protestos.
3. Sistema mostra protestos importados.
4. Funcionario abre um protesto.
5. Funcionario marca que o cliente pagou.
6. Funcionario informa boleto.
7. Sistema coloca o item em boletos pendentes.
8. Chefe faz login.
9. Chefe acessa boletos pendentes.
10. Chefe marca boleto como pago.
11. Sistema atualiza o status.
12. Sistema registra historico.
13. Dashboard atualiza os indicadores.

## Observacoes

- O sistema nao e um sistema completo de cartorio.
- Regras juridicas nao informadas ficam como **(A DEFINIR)**.
- O arquivo `.env` nao deve ser publicado no GitHub.
- A senha do banco deve ficar apenas nas variaveis de ambiente locais ou da Vercel.
