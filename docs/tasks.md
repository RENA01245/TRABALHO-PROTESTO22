# Tasks - Roadmap de Implementação

## T01 - Configuração Inicial

Descrição: criar estrutura base do repositório.

Subtarefas:

- Criar `backend`, `frontend` e `docs`.
- Criar `.gitignore`.
- Criar README.

Dependências: nenhuma.

Resultado esperado: monorepo organizado.

## T02 - Back-end Base

Descrição: configurar API Node.js com Express e TypeScript.

Subtarefas:

- Criar `package.json`.
- Configurar `tsconfig.json`.
- Criar servidor Express.
- Criar rota de health check.

Dependências: T01.

Resultado esperado: API inicial executando.

## T03 - Prisma e Supabase

Descrição: configurar Prisma para PostgreSQL.

Subtarefas:

- Criar `schema.prisma`.
- Modelar entidades principais.
- Criar seed.
- Documentar `DATABASE_URL`.

Dependências: T02.

Resultado esperado: schema pronto para Supabase.

## T04 - Autenticação

Descrição: implementar login JWT e criptografia Bcrypt.

Subtarefas:

- Criar rota de login.
- Criar middleware de autenticação.
- Criar middleware de perfil.
- Criar seed de usuários.

Dependências: T03.

Resultado esperado: usuários autenticados acessam rotas protegidas.

## T05 - Importação de Protestos

Descrição: importar arquivo CSV de protestos.

Subtarefas:

- Criar upload com Multer.
- Validar linhas.
- Registrar lote de importação.
- Registrar erros.
- Criar protestos válidos.

Dependências: T04.

Resultado esperado: funcionário importa CSV e vê resumo.

## T06 - Listagem e Filtros

Descrição: listar protestos com filtros principais.

Subtarefas:

- Filtrar por protocolo.
- Filtrar por devedor.
- Filtrar por CPF/CNPJ.
- Filtrar por status.
- Filtrar por data.

Dependências: T05.

Resultado esperado: tabela de protestos consultável.

## T07 - Detalhes e Ações

Descrição: implementar detalhes do protesto.

Subtarefas:

- Buscar protesto por ID.
- Marcar cliente como pago.
- Informar boleto.
- Alterar status.
- Adicionar observação.

Dependências: T06.

Resultado esperado: funcionário acompanha e atualiza cada caso.

## T08 - Boletos Pendentes

Descrição: implementar tela e API para boletos pendentes.

Subtarefas:

- Listar apenas casos com cliente pago e boleto não pago.
- Permitir chefe marcar boleto como pago.
- Registrar responsável e data.

Dependências: T07.

Resultado esperado: chefe sabe exatamente quais boletos pagar.

## T09 - Histórico

Descrição: registrar ações relevantes.

Subtarefas:

- Registrar importação.
- Registrar cliente pago.
- Registrar boleto informado.
- Registrar boleto pago.
- Registrar mudança de status.

Dependências: T07.

Resultado esperado: detalhes mostram histórico confiável.

## T10 - Dashboard

Descrição: criar indicadores do sistema.

Subtarefas:

- Total de protestos.
- Clientes que pagaram.
- Boletos pendentes.
- Boletos pagos.
- Pendentes.
- Protestados.
- Cancelados.
- Importados hoje.

Dependências: T08.

Resultado esperado: painel inicial resume os casos críticos.

## T11 - Relatórios

Descrição: criar relatório simples e exportação CSV.

Subtarefas:

- Resumo por status.
- Boletos pendentes.
- Boletos pagos.
- Clientes que pagaram.
- Exportar CSV.

Dependências: T10.

Resultado esperado: relatório suficiente para apresentação acadêmica.

## T12 - Front-end Base

Descrição: configurar React com Vite e TypeScript.

Subtarefas:

- Criar rotas.
- Criar layout com menu lateral.
- Criar cliente Axios.
- Criar controle de autenticação.

Dependências: T02.

Resultado esperado: aplicação visual inicial.

## T13 - Telas Principais

Descrição: implementar telas do sistema.

Subtarefas:

- Login.
- Dashboard.
- Importar arquivo.
- Protestos.
- Boletos pendentes.
- Detalhes do protesto.
- Relatório simples.

Dependências: T12.

Resultado esperado: fluxo principal completo no front-end.

## T14 - Layout

Descrição: aplicar estilo administrativo responsivo.

Subtarefas:

- Menu lateral azul escuro.
- Fundo cinza claro.
- Cards brancos.
- Badges coloridas.
- Tabelas organizadas.
- Formulários curtos.

Dependências: T13.

Resultado esperado: interface limpa e profissional.

## T15 - Testes e Deploy

Descrição: validar fluxo e preparar publicação.

Subtarefas:

- Testar fluxo principal.
- Configurar Vercel.
- Configurar Render.
- Configurar Supabase.
- Atualizar README com links finais.

Dependências: T14.

Resultado esperado: sistema pronto para entrega.
