# Backend

> Architecture and organization of the Game Tool backend.

## Table of contents

- [Overview](#overview)
- [Structure](#structure)
  - [`rgt/`](#rgt)
  - [`src/`](#src)
- [Main folders](#main-folders)
  - [`middleware/`](#middleware)
  - [`modules/`](#modules)
  - [`types/`](#types)
  - [`utils/`](#utils)
- [Application architecture](#application-architecture)
  - [Request flow](#request-flow)
  - [Routers](#routers)
  - [Controllers](#controllers)
  - [Database and Mongoose](#database-and-mongoose)
  - [Error handling](#error-handling)
  - [Logging](#logging)
  - [Serialization](#serialization)
- [API and shared contracts](#api-and-shared-contracts)
  - [API contracts](#api-contracts)
  - [Data contracts](#data-contracts)
  - [Shared constants](#shared-constants)
  - [Frontend to backend synchronization](#frontend-to-backend-synchronization)
- [RGT integration](#rgt-integration)
  - [Reusable backend code](#reusable-backend-code)
  - [Project-specific backend code](#project-specific-backend-code)
- [Development](#development)
  - [Backend container](#backend-container)
  - [Development server](#development-server)
  - [Database services](#database-services)
  - [Build and validation](#build-and-validation)
- [Related documentation](#related-documentation)

---

## Overview

The backend is a **TypeScript / Node.js / Express** application using **MongoDB through Mongoose**.

It is split between reusable RGT infrastructure and Game Tool-specific code:

```text
backend/
├── rgt/
└── src/
```

The backend also consumes shared API and data contracts synchronized from the frontend.

---

## Structure

### `rgt/`

`rgt/` contains reusable backend infrastructure and functionality intended to be shared across projects.

Typical responsibilities include:

- middleware;
- reusable backend modules;
- database infrastructure;
- shared types;
- shared utilities;
- reusable constants and helpers.

Reusable backend code should generally live in `rgt/`.

RGT must not depend on arbitrary Game Tool-specific `src/` code.

### `src/`

`src/` contains backend code specific to Game Tool.

This includes project-specific:

- application modules;
- configuration;
- constants;
- integrations;
- domain logic.

Code may move from `src/` to `rgt/` later if it becomes genuinely reusable.

---

## Main folders

### `middleware/`

Contains Express middleware and request-level infrastructure.

Typical responsibilities include:

- authentication;
- centralized error handling;
- request limiting;
- uploads;
- database/application infrastructure where appropriate.

Reusable middleware belongs in RGT.

Project-specific middleware belongs in `src/` when it is tied directly to Game Tool.

### `modules/`

Backend functionality is grouped by domain.

A typical database-backed module may contain:

```text
module/
├── controller.ts
├── router.ts
└── schema.ts
```

Not every module needs every file.

Modules can be split further when their size or responsibilities genuinely require it.

### `types/`

Contains backend TypeScript structures.

The most important shared areas are:

```text
types/api/
types/data/
```

These are synchronized from the frontend.

Backend-only types can exist separately when they are not part of the shared frontend/backend contract.

### `utils/`

Contains reusable backend helpers that do not belong to a more specific module or subsystem.

Small helpers used only inside one module should normally stay close to that module.

---

## Application architecture

### Request flow

The backend request flow is intentionally straightforward:

```text
HTTP request
    ↓
Express router
    ↓
Middleware
    ↓
Controller
    ↓
Mongoose / backend logic
    ↓
Serialized API response
```

The architecture is kept simple unless a domain genuinely requires something more complex.

### Routers

Routers connect:

- centralized API paths;
- middleware;
- controller functions.

They define how requests enter a backend module.

### Controllers

Controllers contain request-specific backend logic.

They may interact directly with Mongoose.

There is currently no general service/repository layer between controllers and the database.

### Database and Mongoose

MongoDB is accessed through Mongoose.

The backend supports multiple database connections through the shared database infrastructure.

Schemas and models use the connection appropriate to their domain.

Internally, application code may work with hydrated Mongoose documents when document behavior is useful.

Data crossing the API boundary must be converted into the appropriate shared representation.

### Error handling

Error responses are centralized.

Controllers and middleware can raise application errors and let the common error middleware construct the HTTP response.

This avoids duplicating error-response logic throughout the backend.

Local error handling remains appropriate when an error needs to be handled or interpreted inside the current operation.

### Logging

Permanent backend logging is handled through `ULog`.

Meaningful backend operations should be logged enough to understand what the application is doing.

Raw `console.log` / `console.error` output should only be used for temporary debugging and should not remain as permanent backend logging.

### Serialization

Mongoose documents should not be returned directly through the API.

Schemas/models are responsible for producing serialized representations compatible with the shared application contracts.

Common normalization includes:

```text
MongoDB _id
    ↓
application uid
```

and any other conversion required to match the public/shared data structure.

Some models may expose dedicated conversion methods when several representations are needed.

---

## API and shared contracts

### API contracts

Shared request and response contracts live in:

```text
types/api/
```

The backend uses these contracts for payloads shared with the frontend.

Frontend and backend should not independently redefine the same API payload when a shared contract already exists.

### Data contracts

Shared application data structures live in:

```text
types/data/
```

The goal is to keep common data representations aligned between:

- frontend;
- backend;
- serialized database data;

where practical.

### Shared constants

Shared frontend/backend constants originate on the frontend and are synchronized to the backend.

Backend-only constants belong in:

```text
backendConsts.ts
```

### Frontend to backend synchronization

The frontend is authoritative for shared contracts.

`share.sh` synchronizes approximately:

```text
frontend/src/types/api   → backend/src/types/api
frontend/src/types/data  → backend/src/types/data

frontend/rgt/types/api   → backend/rgt/types/api
frontend/rgt/types/data  → backend/rgt/types/data
```

It also synchronizes shared constants.

The script performs backend-specific transformations when required, such as:

- removing frontend-only / React-specific dependencies;
- adapting import paths for backend `.js` resolution.

Backend synchronized copies are generated representations.

Do not edit them expecting those changes to survive synchronization.

---

## RGT integration

### Reusable backend code

RGT is the preferred location for backend code that is genuinely reusable across projects.

If Game Tool-specific code later becomes reusable, it may be moved from `src/` into `rgt/`.

The move must not introduce arbitrary dependencies from RGT back into project-specific code.

### Project-specific backend code

Game Tool-specific backend functionality belongs in `src/`.

Project-specific code should not be moved into RGT simply to solve an import-direction issue.

A small number of project files may intentionally be available to RGT when they are guaranteed by the project bootstrap/default structure.

---

## Development

### Backend container

The backend runs in the development Docker environment.

The host source is bind-mounted into:

```text
/home/app
```

Docker provides the development runtime; source code is not normally baked into the development image.

### Development server

The normal backend development command is:

```bash
npm run dev
```

The backend API is exposed on development host port:

```text
8082
```

### Database services

The development environment includes:

- MongoDB;
- Mongo Express.

Mongo Express is exposed on:

```text
8083
```

MongoDB itself is not normally exposed through a host port.

### Build and validation

Before backend work is considered complete, run:

```bash
npm run format
npm run lint
npm run build
```

The backend build is:

```bash
tsc
```

Use the project Makefile as the normal project interface when an equivalent command exists.

---

## Related documentation

- [`BackendConventions.md`](./BackendConventions.md) — rules for writing backend code.
- [`SharedConventions.md`](./SharedConventions.md) — conventions shared by frontend and backend.
- [`RGT.md`](./RGT.md) — RGT ownership and synchronization.
- [`GettingStarted.md`](./GettingStarted.md) — development environment and project commands.
