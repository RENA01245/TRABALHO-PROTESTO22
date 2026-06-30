# Research: Sistema de Controle de Protestos

## Decisions

### Front-end

Decision: Use React with Vite and TypeScript.

Rationale: Required by the academic assignment and appropriate for a responsive administrative site.

Alternatives considered: Plain HTML/CSS/JS would be simpler, but would not satisfy the required React/TypeScript stack.

### Back-end

Decision: Use Node.js, Express and TypeScript.

Rationale: Required stack; Express is enough for a small REST API and keeps implementation understandable for presentation.

Alternatives considered: NestJS was rejected because it adds structure and learning overhead beyond the real scope.

### Database

Decision: Use PostgreSQL on Supabase with Prisma ORM.

Rationale: Required by assignment; Prisma gives schema, migrations and seed in a clear format.

Alternatives considered: SQLite/local storage was rejected for production because Supabase/PostgreSQL is required.

### Authentication

Decision: Use JWT with Bcrypt password hashes.

Rationale: Required by assignment and enough for role-based access in this internal control system.

### File Import

Decision: Implement CSV as the primary import format and mark real official file layout as **(A DEFINIR)**.

Rationale: The assignment states CSV is the main test format and warns not to invent official file rules.

### Presentation Mode

Decision: Include front-end demo fallback data.

Rationale: The project must be presentable as a site even before Supabase, Render and Vercel are configured.

## Risks

- Supabase connection depends on external credentials.
- Render file uploads are not ideal for permanent storage.
- Real protest file layout is unknown.
- Full legal/cartório rules are out of scope.
