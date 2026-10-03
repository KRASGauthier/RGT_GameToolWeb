# Architecture

> High-level architecture of the GameTool repository and the relationships between its main systems.

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
  - [Shared icons and generic types](#shared-icons-and-generic-types)
  - [Shared constants](#shared-constants)
  - [`.system/share.sh`](#systemsharesh)
- [Main application flow](#main-application-flow)
  - [Frontend shell](#frontend-shell)
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
│   └── SecurityConcerns.md
├── Important.md
├── README.md
├── Roadmap.md
├── todo.md
├── Makefile
├── default_env
└── docker-compose.dev.yaml
```

### `frontend/`

Contains the React application.

It is split between:

```text
frontend/rgt/
frontend/src/
```

The frontend is also the authoritative source for the shared frontend/backend contracts synchronized by `.system/share.sh`.

See [`Frontend.md`](./Frontend.md).

### `backend/`

Contains the Node.js / Express application.

It is split between:

```text
backend/rgt/
backend/src/
```

The backend consumes generated/backend-compatible copies of shared contracts originating on the frontend.

See [`Backend.md`](./Backend.md).

### `.system/`

Contains the reusable RGT project infrastructure used to:

- initialize a new RGT-based project;
- synchronize the reusable project baseline between projects;
- synchronize frontend-authoritative contracts to the backend;
- hold bootstrap/default files.

Important scripts include:

```text
.system/manage.sh
.system/init.sh
.system/sync.sh
.system/share.sh
```

`.system/` is infrastructure, not normal GameTool feature code.

### Root files

Important root-level files include:

| File | Purpose |
|---|---|
| `README.md` | Main project description and documentation entry point. |
| `Important.md` | Compact operational reference. |
| `Roadmap.md` | Product/development progression. |
| `todo.md` | Small technical tasks that should not be lost while development continues. |
| `Makefile` | Main command router for development and synchronization. |
| `default_env` | Shareable environment template. |
| `.env` | Real local environment values. It is intentionally synchronized by the local RGT sync system but must not be committed to Git. |
| `docker-compose.dev.yaml` | Development Docker services. |

Security-specific follow-up information lives in [`SecurityConcerns.md`](./SecurityConcerns.md).

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

The normal dependency direction remains:

```text
src
 ↓
rgt
```

Project-specific code may consume RGT infrastructure.

RGT must not import arbitrary project-specific `src/` code. However, RGT deliberately depends on a small number of project-owned integration points that are guaranteed by the RGT baseline.

Current important integration points include:

```text
frontend/src/style/theme.ts
frontend/src/consts.ts
backend/src/backendConsts.ts
backend/src/link/user.ts
synchronized project contracts/constants
```

`backend/src/link/user.ts` is an intentional extension hook. The shared RGT user schema calls it so an application can create or link application-specific user data while the global account remains stored in the shared users database.

The hook must exist even when its implementation is empty.

These guaranteed files are explicit integration points, not permission for RGT to depend freely on `src/`.

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

Changes can later be propagated to or pulled from the saved/shared RGT baseline.

### Project defaults

`.system/defaults/` and `.system/init.sh` define the bootstrap baseline for a new RGT-based project.

The initializer is active infrastructure. Its purpose is to avoid rebuilding the whole development environment for every new application.

The baseline is expected to evolve with RGT. It may temporarily lag behind the current project until a new project is initialized and the missing requirements are discovered/fixed.

The bootstrap/default system is therefore maintained pragmatically when it is used, rather than being treated as a separately perfected template at all times.

### RGT synchronization

RGT synchronization is broader than only copying `frontend/rgt/` and `backend/rgt/`.

It is a shared project-environment synchronization system used so a new RGT application can reuse the established development baseline.

Main commands:

```bash
make sync up
make sync down
```

Direction:

```text
make sync up
SYSTEM_SYNC_PROJECT_LOCATION → SYSTEM_SYNC_SAVE_LOCATION

make sync down
SYSTEM_SYNC_SAVE_LOCATION → SYSTEM_SYNC_PROJECT_LOCATION
```

Current explicit targets include:

```text
.system/
Makefile
docker-compose.dev.yaml
default_env
.gitignore
.env
frontend/rgt/
backend/rgt/
```

The script also synchronizes top-level files inside `frontend/` and `backend/`, except:

```text
package.json
package-lock.json
```

This means files such as Dockerfiles, init scripts, TypeScript configuration, ESLint configuration, Prettier configuration, and Vite configuration can be part of the shared baseline.

`.env` synchronization is intentional for this private/local workflow. `.env` is not a Git-tracked source file and must remain private.

Synchronization uses:

```text
rsync --delete
```

It is synchronization, **not merge**. Files present only on the destination side can be removed.

## Frontend and backend contracts

The frontend is the source of truth for TypeScript contracts and constants that must exist on both application sides.

### Shared API contracts

Shared API contracts live under:

```text
src/types/api/
rgt/types/api/
```

They define request/response structures and runtime checker definitions used by both sides.

### Shared data contracts

Shared application data structures live under:

```text
src/types/data/
rgt/types/data/
```

The frontend representation is authoritative. Backend copies are regenerated through the sharing script.

### Shared icons and generic types

The synchronization also includes:

```text
src/types/icons/
rgt/types/components/
rgt/types/TShared.ts
rgt/types/TStyles.ts
```

The frontend icon library remains the rich/React-side implementation. `.system/share.sh` generates a backend-safe `TIconLibrary` containing only the allowed icon keys.

### Shared constants

The following are also synchronized:

```text
frontend/src/consts/   → backend/src/consts/
frontend/src/consts.ts → backend/src/consts.ts
frontend/rgt/consts.ts → backend/rgt/consts.ts
```

Backend-only values remain backend-owned, for example:

```text
backend/src/backendConsts.ts
backend/rgt/backendConsts.ts
```

### `.system/share.sh`

`make share` runs `.system/share.sh`.

Current synchronized content includes:

```text
frontend/src/types/api        → backend/src/types/api
frontend/src/types/data       → backend/src/types/data
frontend/src/types/icons      → backend/src/types/icons

frontend/rgt/types/api        → backend/rgt/types/api
frontend/rgt/types/data       → backend/rgt/types/data
frontend/rgt/types/components → backend/rgt/types/components

frontend/rgt/types/TShared.ts → backend/rgt/types/TShared.ts
frontend/rgt/types/TStyles.ts → backend/rgt/types/TStyles.ts

frontend/src/consts           → backend/src/consts
frontend/src/consts.ts        → backend/src/consts.ts
frontend/rgt/consts.ts        → backend/rgt/consts.ts
```

Backend transformations currently include:

- removing React-only type imports;
- converting `ReactNode` to backend-safe `string`;
- adding `.js` to relative backend TypeScript imports;
- adapting synchronized constant syntax for the backend;
- generating the backend icon-key union from the frontend icon library.

Synchronized backend files are generated representations. Edit the frontend source of truth and rerun:

```bash
make share
```

## Main application flow

### Frontend shell

The active frontend shell is approximately:

```text
CAppNotifContext
└── App
    └── BrowserRouter
        └── ThemeProvider
            └── CAuthContext
                └── Routes
                    ├── PAuth
                    └── CProtectedRoute
                        └── PBaseTabPage / CTabProvider
                            ├── PHome
                            ├── PProfile
                            ├── PProjectNew
                            └── PProjectNav / CProjectProvider
```

Authentication owns the in-memory access token. Project tabs are persistent through `localStorage`.

### Frontend to backend

The normal request path is:

```text
React UI / Context
      ↓
Frontend domain API function
      ↓
RGT API helper
      ↓
Axios
      ↓
Express router
      ↓
Middleware
      ↓
Controller
```

The shared Axios instance uses credentials so the HttpOnly refresh cookie can travel with authentication requests.

### Backend to database

The backend uses two named Mongoose connections:

```text
appDB.main
appDB.users
```

`main` contains application/GameTool data such as projects and groups.

`users` is the global RGT user database. The intent is for RGT applications to share the same user database/infrastructure so one global account can be reused across applications.

Application-specific user information must not be forced into the global user document. The RGT user schema exposes the required `src/link/user.ts` hook so each application can create/link its own user-side data when needed.

Current GameTool project access is owner-based. The project-user/member system is still work in progress.

### Serialization

Database documents are converted before crossing the API boundary.

Common normalization includes:

```text
MongoDB _id
   ↓
application uid
```

Models/schemas may expose standard conversion methods such as:

```text
getUserBase()
getUserFull()
getProjectFull()
getJSON()
```

Hydrated Mongoose documents should not be returned directly as public API payloads.

## Development architecture

The current Docker architecture is **development-only**.

### Docker services

The development environment contains:

```text
MongoDB
Mongo Express
Frontend Node/Vite
Backend Node/Express
```

The current development Node image is based on:

```text
node:24-alpine
```

### Bind mounts

Frontend and backend source trees are bind-mounted into:

```text
/home/app/
```

Database data and uploaded development files are also persisted through configured local/bind-mounted volumes.

### Makefile

The Makefile is the normal project command interface.

Common commands:

```bash
make dev build
make dev build f
make dev run
make dev rund
make dev re
make dev red
make dev down
make dev clean
make dev wipe

make share
make sync up
make sync down
make help
```

The build path runs `make share` before Docker build.

> [!CAUTION]
> `make dev clean` currently removes **all Docker images and volumes on the host**, not only GameTool resources.

`make dev wipe` also prunes Docker builder cache.

### Development ports

Current default host ports:

| Service | Port |
|---|---:|
| Frontend | `8081` |
| Backend API | `8082` |
| Mongo Express | `8083` |

The backend listens on port `8080` inside its container. MongoDB is not normally exposed through a host port.

## Related documentation

- [`Frontend.md`](./Frontend.md) — frontend structure and architecture.
- [`Backend.md`](./Backend.md) — backend structure and architecture.
- [`RGT.md`](./RGT.md) — detailed RGT synchronization and ownership.
- [`GettingStarted.md`](./GettingStarted.md) — development environment and setup.
- [`SharedConventions.md`](./SharedConventions.md) — shared coding conventions.
- [`FrontendConventions.md`](./FrontendConventions.md) — frontend coding conventions.
- [`BackendConventions.md`](./BackendConventions.md) — backend coding conventions.
- [`SecurityConcerns.md`](./SecurityConcerns.md) — security items that should be reviewed as the project approaches production.
