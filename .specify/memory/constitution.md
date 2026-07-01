# Project Constitution

## Core Principles

### I. Spec-Driven Development

All meaningful work must follow the Spec Kit flow:

1. Constitution
2. Specify
3. Plan
4. Tasks
5. Implement

Feature specifications must live under `specs/`.

### II. Real Problem Scope

The system exists to control protests, client payments and boleto handoff to the chefe. It must remain simple, functional and presentable.

It must not become a complete cartório system.

### III. Technology Rules

- Front-end must use React, TypeScript and Vite.
- Back-end must use Node.js, Express and TypeScript.
- Database must be PostgreSQL on Supabase.
- Prisma must be used as ORM.
- Authentication must use JWT.
- Passwords must use Bcrypt.

### IV. Domain Boundaries

Do not invent legal/cartório rules. Any legal rule not explicitly provided must be marked as **(A DEFINIR)**.

### V. Quality Gates

- Documentation must exist before implementation.
- Build must pass before delivery.
- The main acceptance flow must be demonstrable.
- Sensitive keys must not be committed.

## Architecture

The repository is a web application with:

- `backend/`: REST API and database access.
- `frontend/`: React site and demo interface.
- `specs/`: official Spec Kit feature documentation.

## Development Workflow

1. Create or update feature spec in `specs/`.
2. Create plan using Spec Kit templates/scripts.
3. Create tasks using Spec Kit templates/scripts.
4. Implement the smallest complete feature slices.
5. Validate build and acceptance flow.

## Governance

This constitution takes priority over ad hoc implementation choices. Any scope expansion must be documented in the feature spec and plan before implementation.
