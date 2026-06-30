# Constitution - Sistema de Controle de Protestos e Repasse de Pagamentos

## 1. Objetivo

Este projeto deve entregar uma aplicação web simples, funcional e apresentável para controle interno de protestos, pagamentos de clientes e repasse de boletos ao chefe.

O sistema existe para responder a uma necessidade real do trabalho: quando um cliente paga, o funcionário registra essa informação, informa ou anexa o boleto relacionado, e o chefe visualiza quais boletos precisam ser pagos.

## 2. Limite de Escopo

O sistema não é um sistema completo de cartório. Não serão implementadas regras jurídicas avançadas, fluxos oficiais de cartório, relatórios complexos ou módulos administrativos fora do uso informado.

Regras jurídicas específicas não informadas devem ser registradas como **(A DEFINIR)**.

## 3. Metodologia

O projeto segue SDD - Spec-Driven Development com fluxo Spec Kit:

1. Constitution
2. Specify
3. Plan
4. Tasks
5. Implement

Nenhuma implementação deve ser feita antes da documentação inicial estar criada.

## 4. Tecnologias Obrigatórias

- Front-end: React, TypeScript, Vite, React Router, Axios, React Hook Form e Zod.
- Back-end: Node.js, Express, TypeScript, Prisma, JWT, Bcrypt, Multer e Zod.
- Banco de dados: PostgreSQL hospedado no Supabase.
- ORM: Prisma.
- API: REST.
- Deploy: Front-end na Vercel, back-end na Render e banco no Supabase.

## 5. Arquitetura

O repositório deve ser organizado como monorepo simples:

```text
backend/
frontend/
docs/
README.md
.gitignore
```

O back-end expõe a API REST e concentra autenticação, autorização, regras de negócio, importação de arquivos, histórico e acesso ao banco.

O front-end consome a API REST e oferece telas administrativas responsivas para funcionário, chefe e administrador.

## 6. Padrões de Código

- Usar TypeScript em todo código de aplicação.
- Separar responsabilidades por camada.
- Validar entradas com Zod.
- Evitar regras duplicadas entre controllers e services.
- Usar nomes claros e alinhados ao domínio informado.
- Não criar entidades ou fluxos que não estejam nos requisitos.
- Comentários devem ser usados apenas quando ajudarem a entender regra não óbvia.

## 7. Segurança

- Apenas usuários autenticados acessam rotas protegidas.
- A autenticação usa JWT.
- Senhas são armazenadas com hash Bcrypt.
- Cada usuário possui perfil: FUNCIONARIO, CHEFE ou ADMIN.
- Rotas sensíveis devem validar perfil.
- Uploads devem validar tipo e tamanho.

## 8. Banco de Dados

- O banco oficial é PostgreSQL no Supabase.
- O Prisma deve ser usado para schema, migrations, seed e acesso ao banco.
- O arquivo `.env` deve conter `DATABASE_URL`.
- Dados reais sensíveis não devem ser versionados.

## 9. Testes

A estratégia mínima inclui:

- Testes manuais do fluxo principal.
- Validação de importação CSV.
- Validação de login e permissões por perfil.
- Verificação dos indicadores do dashboard.
- Verificação do histórico após ações importantes.

Testes automatizados podem ser adicionados conforme tempo disponível.

## 10. Versionamento

- O projeto deve usar Git.
- O repositório final deve ser publicado no GitHub.
- Commits devem representar entregas coerentes: documentação, back-end, front-end e ajustes de deploy.

## 11. Deploy

- Front-end publicado na Vercel.
- Back-end publicado na Render.
- Banco PostgreSQL no Supabase.
- Variáveis de ambiente devem ser configuradas nos provedores de deploy.

## 12. Princípios de Desenvolvimento

- Resolver primeiro o fluxo principal.
- Manter o produto simples e apresentável.
- Priorizar clareza sobre excesso de funcionalidades.
- Não inventar domínio jurídico.
- Marcar pontos desconhecidos como **(A DEFINIR)**.
- O card mais importante do dashboard é "Boletos pendentes para pagamento".
