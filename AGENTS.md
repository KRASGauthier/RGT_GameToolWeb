# AGENTS.md

## Purpose

This file is the entry point for AI agents working on GameTool.

Do **not** treat this file as the full project documentation.

Its role is to tell you **which documentation to read before modifying a given part of the project**.

Always read the relevant documentation before making architectural, structural, or convention-related changes.

---

## Start Here

Before making changes, read:

1. [`Important.md`](./Important.md)
2. The relevant `.info/` document for the area you are modifying.

`Important.md` is the compact operational summary of the project.

The `.info/` directory contains the detailed documentation.

---

## Documentation Routing

### General Architecture

Read:

- [`.info/Architecture.md`](./.info/Architecture.md)
- [`Important.md`](./Important.md)

Use these for:

- repository structure;
- application boundaries;
- frontend/backend relationships;
- shared systems;
- architectural decisions.

---

### Frontend Work

Read:

- [`.info/Frontend.md`](./.info/Frontend.md)
- [`.info/FrontendConventions.md`](./.info/FrontendConventions.md)
- [`.info/SharedConventions.md`](./.info/SharedConventions.md)

Use these before modifying:

- React pages;
- components;
- contexts;
- hooks;
- frontend API code;
- frontend types;
- frontend styling;
- routing;
- MUI/RGT UI infrastructure.

---

### Backend Work

Read:

- [`.info/Backend.md`](./.info/Backend.md)
- [`.info/BackendConventions.md`](./.info/BackendConventions.md)
- [`.info/SharedConventions.md`](./.info/SharedConventions.md)

Use these before modifying:

- backend modules;
- controllers;
- routers;
- schemas/models;
- authentication;
- middleware;
- API validation;
- database logic;
- image/file handling.

---

### RGT / Shared Infrastructure

Read:

- [`.info/RGT.md`](./.info/RGT.md)
- [`.info/Architecture.md`](./.info/Architecture.md)
- [`.info/SharedConventions.md`](./.info/SharedConventions.md)

Use these before modifying:

- `frontend/rgt/`;
- `backend/rgt/`;
- `.system/`;
- shared contracts;
- synchronization infrastructure;
- bootstrap/default project infrastructure;
- RGT integration hooks.

Do not move project-specific code into RGT only to solve dependency problems.

---

### Setup / Docker / Development Commands

Read:

- [`.info/GettingStarted.md`](./.info/GettingStarted.md)
- [`.info/RGT.md`](./.info/RGT.md)

Use these for:

- Docker;
- Makefile commands;
- environment setup;
- synchronization commands;
- project initialization;
- development services.

---

### Security-Sensitive Work

Read:

- [`.info/SecurityConcerns.md`](./.info/SecurityConcerns.md)
- [`.info/Backend.md`](./.info/Backend.md)

Use these before modifying:

- authentication;
- authorization;
- sessions;
- JWT/refresh-token handling;
- user search/exposure;
- project access;
- private assets;
- production-sensitive behavior.

Do not silently resolve items listed in `SecurityConcerns.md` unless the task explicitly requires it.

---

### Technical Follow-Up Tasks

Read:

- [`todo.md`](./todo.md)

`todo.md` contains implementation-level follow-up work that does not belong in the product roadmap.

Do not assume a TODO must be implemented as part of an unrelated task.

---

### Product / Feature Direction

Read:

- [`Roadmap.md`](./Roadmap.md)
- [`README.md`](./README.md)

Use these for:

- feature progression;
- current product scope;
- future systems;
- high-level project purpose.

The roadmap is not a substitute for the technical `.info` documentation.

---

## Source of Truth

When documentation and code disagree:

1. inspect the current code carefully;
2. determine whether the code is current, WIP, or legacy;
3. do not blindly preserve outdated documentation;
4. update documentation when the task includes documentation maintenance.

Do not assume unfinished/WIP code represents finalized architecture.

---

## Important Boundaries

- `frontend/` owns the authoritative shared frontend/backend contracts before synchronization.
- Generated/synchronized backend copies must not be treated as the source of truth.
- `.info/yishan/` is not part of the main GameTool documentation and should not be modified unless explicitly requested.
- `.env` is private and must never be committed to Git.
- `rgt/` is reusable/shared infrastructure.
- `src/` is GameTool-specific application code.
- RGT may depend only on explicit guaranteed integration points from project-specific code.

---

## Before Finishing Code Changes

Follow the validation process documented in [`Important.md`](./Important.md) and [`.info/GettingStarted.md`](./.info/GettingStarted.md).

For each modified frontend/backend side, run the required:

```bash
npm run format
npm run lint
npm run build
```

Use `make share` when synchronized contracts/constants have changed.

Do not run destructive commands without checking their documented behavior first.

---

## Documentation Rule

Do not duplicate large sections of project documentation inside `AGENTS.md`.

If agents need additional information, update the appropriate existing document and add or adjust the routing here only when necessary.
