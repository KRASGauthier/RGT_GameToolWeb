# Backend

> Architecture and organization of the GameTool backend.

## Table of contents

- [Overview](#overview)
- [Structure](#structure)
  - [`rgt/`](#rgt)
  - [`src/`](#src)
- [Main folders](#main-folders)
  - [`middleware/`](#middleware)
  - [`modules/`](#modules)
  - [`types/`](#types)
  - [`util/`](#util)
- [Application architecture](#application-architecture)
  - [Request flow](#request-flow)
  - [Routers](#routers)
  - [Controllers](#controllers)
  - [Database and Mongoose](#database-and-mongoose)
  - [Shared user extension hook](#shared-user-extension-hook)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Projects](#projects)
  - [Project groups](#project-groups)
  - [Images](#images)
  - [Error handling](#error-handling)
  - [Logging](#logging)
  - [Serialization](#serialization)
- [API and shared contracts](#api-and-shared-contracts)
  - [API contracts](#api-contracts)
  - [Runtime checkers](#runtime-checkers)
  - [Data contracts](#data-contracts)
  - [Shared constants and icons](#shared-constants-and-icons)
  - [Frontend-to-backend synchronization](#frontend-to-backend-synchronization)
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

It is split between:

```text
backend/rgt/
backend/src/
```

`rgt/` contains reusable cross-application infrastructure.

`src/` contains GameTool-specific modules and integration points.

The backend currently includes real implementations for:

- authentication and refresh-token rotation;
- global/shared users and profile management;
- project creation/access/settings;
- project cover images;
- project groups;
- image serving;
- shared runtime API checking;
- centralized error handling;
- rate limiting;
- schema/global version metadata.

Project members are currently work in progress and should not yet be treated as a completed backend domain.

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

### `util/`

Contains reusable backend helpers that do not belong to a more specific module or subsystem.

Small helpers used only inside one module should normally stay close to that module.

---

## Application architecture

### Request flow

The normal backend request path is:

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

There is no mandatory service/repository layer. Controllers can interact directly with Mongoose.

### Routers

Routers connect centralized API-path constants, middleware, and controller functions.

Current major routes include:

```text
/auth
/users
/projects
/images
```

Project routes are mounted behind `verifyJWT`.

More specific project authorization is handled inside the project module.

### Controllers

Controllers own request-specific backend behavior.

Controller naming now favors:

```text
<module><Action>
```

Examples:

```text
projectGet
projectModify
groupCreate
groupDelete
userGetSearch
```

The action name should explain the operation; it does not need to mechanically repeat the HTTP verb.

Older functions may still use another naming form. They do not need to be renamed unless that area is being refactored.

### Database and Mongoose

The backend currently opens two Mongoose connections:

```text
appDB.main
appDB.users
```

`appDB.main` stores GameTool/application data such as projects and groups.

`appDB.users` stores the global RGT user accounts.

The intended RGT architecture uses the same users database/infrastructure across applications so one account/password can be reused across them.

Global user validation rules therefore belong to the shared RGT account model and must remain aligned between applications.

GameTool-specific or game-project-specific information must not be pushed into the global user document merely because it relates to a user.

### Shared user extension hook

The RGT user schema calls:

```text
backend/src/link/user.ts
```

through `linkUserPreSave(...)`.

This is a required project-owned RGT integration hook.

Its purpose is to let an application create/link application-specific user information while keeping the main account global/shared.

The hook must exist even when it currently performs no work.

The RGT user schema invokes the hook from the user `pre("save")` lifecycle, so an application implementation should tolerate repeated calls rather than assuming it can only run once at account creation.

### Authentication

Current authentication uses:

- Argon2 password hashes;
- short-lived JWT access tokens;
- HttpOnly refresh cookies;
- refresh-token rotation;
- refresh-token reuse detection;
- per-user refresh mutex locking;
- logout;
- logout everywhere;
- login/register rate limiting;
- Helmet;
- JWT middleware.

Token lifetime constants are currently development values and should not be treated as permanent product settings.

Refresh tokens are currently stored directly on the shared user document. Application-scoping of those sessions is a pre-production task tracked in the root `todo.md`.

### Users

The shared user module supports:

- registration;
- username availability;
- login/auth integration;
- public/basic user search;
- self profile retrieval/editing;
- avatar upload;
- password changes.

Public user search intentionally returns only the basic public user representation.

The abuse/enumeration aspect of that endpoint is tracked in [`SecurityConcerns.md`](./SecurityConcerns.md).

### Projects

Current project persistence includes:

- owner;
- name;
- game title;
- cover;
- version;
- engine;
- language;
- timestamps/version metadata.

Current project access is owner-based:

```text
project.owner == authenticated user
```

The project-member system is still work in progress.

Engine and language are intentionally fixed after project creation in the current implementation because they influence parsing/project structure. Backend validation of valid engine/language combinations is tracked in `todo.md`.

`lastOpened` exists in the shared project contract but is not implemented yet. It is intended to become per-user/per-project recency information used for project ordering.

### Project groups

Project groups currently support:

- list;
- create;
- edit;
- delete;
- name;
- icon;
- color.

Groups are intended to become a flexible mix of organizational tags/roles and, potentially later, permissions.

Their near-term practical use is assignment/organization, for example assigning a to-do to a group or to individual project users.

`count` is not stored in the group document. It is intended to be derived response data representing how many project users belong to the group. Until project-user membership exists, it can remain absent/zero.

### Images

Image files are stored under the configured backend upload location.

Current access policy:

```text
user avatars
→ public static route

project images
→ authenticated static route
```

Project images currently require a valid access token. Project membership/authorization integration will evolve with the project-user system.

### Error handling

Backend errors are centralized through `errorMiddleware` / `handleError`.

Controllers and middleware can throw application errors and let the common handler construct the API response.

### Logging

The reusable logging utilities live under `rgt/util/ULog.ts`.

Direct `console` output still exists in some development/debug paths. Treat that as implementation-level development output rather than a reason to create a second logging architecture.

### Serialization

Hydrated Mongoose documents are converted before crossing the API boundary.

Current conversion patterns include:

```text
getUserBase()
getUserFull()
getProjectFull()
getJSON()
```

Common normalization includes:

```text
MongoDB _id
    ↓
application uid
```

Do not return hydrated documents directly as public API payloads.

## API and shared contracts

### API contracts

Shared API contracts live under:

```text
src/types/api/
rgt/types/api/
```

The frontend copy is authoritative and synchronized to the backend.

### Runtime checkers

`TAPIChecker` definitions provide a lightweight runtime description of API payload shape.

Backend `checkApi(...)` currently validates:

- unexpected fields;
- missing required fields;
- primitive field types;
- array container type;
- nested object checker structures.

Array checker definitions can contain a nested checker, but the current runtime does not yet apply that checker to every array entry. That missing behavior is tracked in the root `todo.md`.

### Data contracts

Shared application data structures live under:

```text
src/types/data/
rgt/types/data/
```

Frontend representations are synchronized to backend-compatible copies.

### Shared constants and icons

Shared project/RGT constants originate on the frontend.

The icon library is also synchronized as a backend-safe key union generated from the frontend icon-library keys.

### Frontend-to-backend synchronization

`make share` runs `.system/share.sh`.

The current synchronized surface includes:

```text
src/types/api
src/types/data
src/types/icons

rgt/types/api
rgt/types/data
rgt/types/components
rgt/types/TShared.ts
rgt/types/TStyles.ts

src/consts
src/consts.ts
rgt/consts.ts
```

Backend copies are generated representations.

Do not edit synchronized backend copies expecting those changes to survive the next share.

## RGT integration

### Reusable backend code

Reusable backend infrastructure belongs in `backend/rgt/`.

Current examples include:

- auth;
- global/shared users;
- JWT middleware;
- rate limiting;
- upload middleware;
- DB connection infrastructure;
- API checking;
- schema-version helpers;
- image-path helpers;
- mutex support.

### Project-specific backend code

GameTool-specific backend code belongs in `backend/src/`.

Current examples include:

- projects;
- project groups;
- project image routing;
- GameTool project constants;
- `backend/src/link/user.ts`.

RGT must not depend on arbitrary `src/` code.

`src/link/user.ts`, project constants, backend constants, and synchronized contracts are explicit project integration points guaranteed by the RGT baseline.

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
- [`SecurityConcerns.md`](./SecurityConcerns.md) — security items to review as production approaches.
