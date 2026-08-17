# Architecture

> High-level architecture of the Game Tool repository and the relationships between its main systems.

## Table of contents

- [Overview](#overview)
- [Repository structure](#repository-structure)
  - [`frontend/`](#frontend)
  - [`backend/`](#backend)
  - [`.system/`](#system)
  - [Root files](#root-files)
- [Code ownership](#code-ownership)
  - [`rgt/`](#rgt)
  - [`src/`](#src)
  - [Dependency direction](#dependency-direction)
  - [Moving code between `src/` and `rgt/`](#moving-code-between-src-and-rgt)
- [Shared infrastructure](#shared-infrastructure)
  - [RGT](#rgt-1)
  - [Project defaults](#project-defaults)
  - [RGT synchronization](#rgt-synchronization)
- [Frontend and backend contracts](#frontend-and-backend-contracts)
  - [Shared API contracts](#shared-api-contracts)
  - [Shared data contracts](#shared-data-contracts)
  - [Shared constants](#shared-constants)
  - [`share.sh`](#sharesh)
- [Main application flow](#main-application-flow)
  - [Frontend to backend](#frontend-to-backend)
  - [Backend to database](#backend-to-database)
  - [Serialization](#serialization)
- [Development architecture](#development-architecture)
  - [Docker services](#docker-services)
  - [Bind mounts](#bind-mounts)
  - [Makefile](#makefile)
  - [Development ports](#development-ports)
- [Related documentation](#related-documentation)

---

## Overview

Game Tool is a full-stack TypeScript application composed of:

- a React frontend;
- a Node.js / Express backend;
- MongoDB;
- shared RGT infrastructure;
- synchronization tooling under `.system/`.

At repository level, the architecture is built around two important boundaries:

1. **frontend vs backend** — application runtime separation;
2. **`rgt/` vs `src/`** — reusable infrastructure vs Game Tool-specific code.

The project also has a frontend-authoritative contract system used to keep shared API, data, and constants synchronized with the backend.

---

## Repository structure

At a high level:

```text
project/
├── frontend/
├── backend/
├── .system/
├── .info/
├── README.md
├── Roadmap.md
├── Makefile
└── share.sh
```

### `frontend/`

Contains the React application.

It includes both:

```text
frontend/rgt/
frontend/src/
```

The frontend is also the authoritative source for shared frontend/backend contracts.

See [`Frontend.md`](./Frontend.md) for frontend-specific architecture.

### `backend/`

Contains the Node.js / Express application.

It includes both:

```text
backend/rgt/
backend/src/
```

The backend consumes synchronized copies of the shared API/data contracts defined on the frontend.

See [`Backend.md`](./Backend.md) for backend-specific architecture.

### `.system/`

Contains shared infrastructure used to bootstrap and synchronize RGT-based projects.

Its responsibilities include:

- project initialization/default files;
- synchronization scripts;
- shared RGT repository integration.

`.system` is not normal application feature code.

### Root files

Important root-level files include:

| File | Purpose |
|---|---|
| `README.md` | Main project entry point and documentation index. |
| `Roadmap.md` | Product and development roadmap. |
| `Makefile` | Main command interface for development workflows. |
| `share.sh` | Frontend → backend contract synchronization. |

---

## Code ownership

### `rgt/`

`rgt/` contains code and infrastructure intended to be reusable across projects.

Both frontend and backend can contain their own `rgt/` tree.

Examples include reusable:

- components;
- hooks;
- middleware;
- API helpers;
- database infrastructure;
- types;
- utilities;
- shared styles.

When something is genuinely reusable, **prefer RGT**.

### `src/`

`src/` contains Game Tool-specific code.

This includes application logic, pages, modules, configuration, and behavior that is tied directly to this project.

A folder type is not reserved to `rgt/` or `src/`.

For example, both can contain:

```text
components/
types/
api/
style/
modules/
```

The location is decided by ownership and reusability.

### Dependency direction

The normal dependency direction is:

```text
src
 ↓
rgt
```

Project-specific code may consume shared RGT infrastructure.

RGT must not import arbitrary project-specific `src/` code.

A small number of project files are deliberately guaranteed by the project bootstrap and may be consumed by RGT, such as:

- frontend `src/style/theme.ts`;
- project constants;
- backend project constants;
- synchronized contracts/constants.

These are explicit integration points, not a general exception.

### Moving code between `src/` and `rgt/`

Code ownership may evolve.

If something starts project-specific but later becomes genuinely reusable, it can be moved:

```text
src/
 ↓
rgt/
```

Do not leave reusable infrastructure in `src/` merely because that is where it originated.

Conversely, do not move project-specific code into RGT just to avoid an import-direction issue.

---

## Shared infrastructure

### RGT

RGT is the shared cross-project codebase used by Game Tool.

The project contains its own working copies of frontend and backend RGT code.

Collaborators normally edit the project copy directly.

Changes can later be propagated to or pulled from the central shared RGT repository.

### Project defaults

`.system/defaults` and related initialization files define mandatory or default project baseline files.

These defaults ensure that certain project-specific integration files exist even when RGT depends on them.

This is why some otherwise unusual dependencies from RGT into guaranteed project files are acceptable.

### RGT synchronization

RGT synchronization is handled by the `.system` synchronization infrastructure.

Important environment variables include:

```text
SYSTEM_SYNC_PROJECT_LOCATION
SYSTEM_SYNC_SAVE_LOCATION
```

Main commands:

```bash
make sync up
make sync down
```

Direction:

```text
make sync up
project RGT → shared RGT repository

make sync down
shared RGT repository → project RGT
```

Synchronization uses:

```text
rsync --delete
```

This is synchronization, **not merge**.

Files that no longer exist on the source side can therefore be deleted on the destination side.

---

## Frontend and backend contracts

### Shared API contracts

Shared API contracts live under:

```text
types/api/
```

They define request/response payloads used by both frontend and backend.

The frontend copy is authoritative.

### Shared data contracts

Shared application data structures live under:

```text
types/data/
```

They are intended to remain aligned between:

- frontend;
- backend;
- serialized database data;

where practical.

The frontend copy is authoritative.

### Shared constants

Shared constants also originate on the frontend.

Backend-only constants remain backend-specific and belong in backend constant files such as:

```text
backendConsts.ts
```

### `share.sh`

`share.sh` is separate from RGT synchronization.

Its purpose is to synchronize shared frontend/backend contracts.

Approximate synchronization:

```text
frontend/src/types/api   → backend/src/types/api
frontend/src/types/data  → backend/src/types/data

frontend/rgt/types/api   → backend/rgt/types/api
frontend/rgt/types/data  → backend/rgt/types/data

frontend project constants → backend equivalents
frontend RGT constants     → backend equivalents
```

The backend copies are generated/backend-compatible representations.

`share.sh` performs transformations where required, including:

- removing frontend-only / React-specific imports and types;
- adapting import paths for backend `.js` resolution.

Do not edit synchronized backend copies expecting those changes to survive.

Modify the frontend source of truth.

---

## Main application flow

### Frontend to backend

The normal application request path is:

```text
React UI
   ↓
Frontend domain API function
   ↓
Shared frontend API helper
   ↓
HTTP / Axios
   ↓
Express backend
```

The frontend should use the shared API contracts that describe the backend payload.

### Backend to database

The normal backend flow is:

```text
Express router
   ↓
Middleware
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
```

The current architecture intentionally allows controllers to use Mongoose directly.

There is no general service/repository layer requirement.

### Serialization

Database documents are not intended to be exposed directly as API responses.

The backend converts Mongoose data into the appropriate shared application representation before sending it to the frontend.

Common normalization includes:

```text
MongoDB _id
   ↓
application uid
```

Schemas/models own the conversion logic when appropriate.

---

## Development architecture

The current Docker architecture is **development-only**.

No production architecture should be inferred from it.

### Docker services

The main development services are:

```text
MongoDB
Mongo Express
Frontend Node
Backend Node
```

The Node development image used by the project is based on:

```text
node:24-alpine
```

### Bind mounts

Frontend and backend source code is bind-mounted from the host into:

```text
/home/app
```

Docker provides the development runtime/environment.

The source code is not normally baked into the development image.

### Makefile

The Makefile is the main command router for normal development operations.

Examples include:

```bash
make dev
make build
make run
make rund
make re
make red
make down
make clean
make wipe
make share
make sync up
make sync down
make help
```

Use the Makefile when an equivalent project command already exists.

> [!CAUTION]
> `make dev clean` currently removes **all Docker images and volumes on the host**, not only Game Tool resources.

### Development ports

Stable development host ports:

| Service | Port |
|---|---:|
| Frontend | `8081` |
| Backend API | `8082` |
| Mongo Express | `8083` |

MongoDB itself is not normally exposed through a host port.

---

## Related documentation

- [`Frontend.md`](./Frontend.md) — frontend structure and architecture.
- [`Backend.md`](./Backend.md) — backend structure and architecture.
- [`RGT.md`](./RGT.md) — detailed RGT synchronization and ownership.
- [`GettingStarted.md`](./GettingStarted.md) — development environment and setup.
- [`SharedConventions.md`](./SharedConventions.md) — shared coding conventions.
- [`FrontendConventions.md`](./FrontendConventions.md) — frontend coding conventions.
- [`BackendConventions.md`](./BackendConventions.md) — backend coding conventions.
