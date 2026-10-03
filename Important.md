# Important

> Quick reference for the parts of GameTool that should be understood before working on the project.

## Table of contents

- [Start / Main Commands](#start--main-commands)
- [`rgt/` vs `src/`](#rgt-vs-src)
- [RGT Synchronization](#rgt-synchronization)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Shared Users](#shared-users)
- [Shared Contracts & Automatic Synchronization](#shared-contracts--automatic-synchronization)
- [Frontend API Infrastructure](#frontend-api-infrastructure)
- [Backend API Infrastructure](#backend-api-infrastructure)
- [Frontend Component Example](#frontend-component-example)
- [Frontend Style Example](#frontend-style-example)
- [Critical Warnings](#critical-warnings)
- [Before Finishing / Pushing](#before-finishing--pushing)
- [Backend Module Pattern](#backend-module-pattern)
- [Documentation Reference](#documentation-reference)

---

## Start / Main Commands

Use the **Makefile** as the normal project interface.

Start development in the foreground:

```bash
make dev run
```

Start development in detached mode:

```bash
make dev rund
```

Stop development:

```bash
make dev down
```

Other useful commands:

```bash
make dev build
make dev build f
make dev re
make dev red
make share
make sync up
make sync down
make help
```

Development services:

| Service | Address |
|---|---|
| Frontend | `http://localhost:8081` |
| Backend API | `http://localhost:8082` |
| Mongo Express | `http://localhost:8083` |

---

## `rgt/` vs `src/`

Both frontend and backend contain:

```text
rgt/
src/
```

Use:

```text
rgt/
→ reusable cross-project code and infrastructure

src/
→ GameTool-specific code
```

When something is genuinely reusable, **prefer RGT**.

Normal dependency direction:

```text
src
 ↓
rgt
```

RGT must not import arbitrary project-specific `src` code.

Explicit guaranteed integration points are allowed when they are part of the RGT baseline. Important examples include:

```text
backend/src/link/user.ts
project/shared constants
synchronized contracts
backend-specific constants
```

`backend/src/link/user.ts` is an intentional extension hook used by the reusable user system so an application can create or link its own application-specific user data.

If code starts in `src/` and later becomes genuinely reusable, move it into `rgt/`.

Do not move project-specific code into RGT merely to solve an import problem.

---

## RGT Synchronization

`make sync up` and `make sync down` synchronize the shared RGT/project baseline used to avoid rebuilding the same development environment for every RGT application.

This synchronization is intentionally broader than only:

```text
frontend/rgt/
backend/rgt/
```

It also includes shared project infrastructure such as:

```text
.system/
Makefile
docker-compose.dev.yaml
default_env
.gitignore
.env
frontend/backend top-level configuration files
```

Package manifests are intentionally excluded from the normal sync.

Direction matters:

```bash
make sync up
# current project -> shared RGT save location

make sync down
# shared RGT save location -> current project
```

> [!CAUTION]
> Synchronization uses `rsync --delete`.
> It is synchronization, not merge. Files missing from the source side can be removed from the destination.

`.env` is intentionally included in this private/local synchronization workflow.

It must remain excluded from Git and must never be treated as a public/shareable source file.

---

## Frontend Structure

High-level frontend structure:

```text
frontend/
├── public/
├── rgt/
├── src/
├── index.html
└── ...
```

Common folders under `rgt/` or `src/`:

```text
api/
components/
context/
hooks/
pages/
style/
types/
utils/
```

Important roles:

| Location | Purpose |
|---|---|
| `api/` | Frontend API-call logic. |
| `components/` | Reusable UI components. |
| `context/` | React contexts/providers. |
| `hooks/` | Custom hooks. |
| `pages/` | Page-level and page-owned application content. |
| `style/` | Component and component-family styling. |
| `types/` | Shared, generic, or heavily reused types. |
| `utils/` | Reusable helpers. |
| `src/style/theme.ts` | Project design source of truth. |
| `consts.ts` | Centralized shared constants, including API paths. |

Current application-level frontend infrastructure includes:

```text
CAppNotifContext
CAuthContext
CTabProvider
CProjectProvider
PBaseTabPage
```

The frontend copy of synchronized shared contracts and constants is authoritative.

---

## Backend Structure

High-level backend structure:

```text
backend/
├── rgt/
└── src/
```

Common backend areas:

```text
middleware/
modules/
types/
util/
```

Important roles:

| Location | Purpose |
|---|---|
| `middleware/` | Shared Express/request infrastructure. |
| `modules/` | Backend functionality grouped by domain/module. |
| `types/` | Backend and synchronized shared types. |
| `util/` | Reusable backend utilities. |
| `backendConsts.ts` | Backend-only constants. |
| `src/index.ts` | Backend application entry point. |
| `src/link/` | Guaranteed project/application hooks required by RGT. |

The backend currently uses separate Mongoose connections for:

```text
main application data
shared users data
```

Current implemented backend domains include authentication, users/profile, projects, project groups, image serving, API validation, JWT middleware, and centralized error handling.

The backend consumes synchronized copies of shared frontend contracts.

---

## Shared Users

RGT users are designed to be shared across RGT applications.

The shared user database contains global account data such as authentication and base profile information.

Application-specific data must remain outside the global user record.

Conceptually:

```text
Shared RGT user
      ↓
application-specific user/link data
      ↓
game-project-specific user data
```

`backend/src/link/user.ts` is the application extension hook used by the reusable user schema.

The hook is called from the user save lifecycle and must tolerate repeated calls.

Game-project membership is a separate concept from the global RGT account.

The current `IProjectUser` work is still WIP and is intended to represent one user's relationship with one game project.

---

## Shared Contracts & Automatic Synchronization

The **frontend is the source of truth** for synchronized frontend/backend contracts.

Current synchronized areas include:

```text
frontend/src/types/api
    → backend/src/types/api

frontend/src/types/data
    → backend/src/types/data

frontend/src/types/icons
    → backend/src/types/icons

frontend/rgt/types/api
    → backend/rgt/types/api

frontend/rgt/types/data
    → backend/rgt/types/data

frontend/rgt/types/components
    → backend/rgt/types/components

frontend/rgt/types/TShared.ts
    → backend/rgt/types/TShared.ts

frontend/rgt/types/TStyles.ts
    → backend/rgt/types/TStyles.ts

frontend/src/consts
frontend/src/consts.ts
frontend/rgt/consts.ts
    → backend equivalents
```

Synchronization is performed by:

```bash
make share
```

The sharing script also performs backend-specific transformations where required, including:

- removing React/frontend-only type imports;
- converting `ReactNode` to backend-safe representations;
- adding `.js` to relative backend imports;
- adapting synchronized constant syntax;
- generating the backend `TIconLibrary` from frontend icon-library keys.

> [!IMPORTANT]
> Backend synchronized copies are generated copies.
> Do not edit them expecting the changes to survive. Modify the frontend source of truth and run `make share`.

`make share` is separate from `make sync up/down`.

---

## Frontend API Infrastructure

Frontend API implementation belongs in:

```text
api/
```

Normal flow:

```text
UI / Context
      ↓
Domain API function
      ↓
Shared API helper
      ↓
Axios
      ↓
Backend
```

Pages/components should not contain direct Axios/request implementation.

Domain API functions intentionally may receive and handle:

- setters;
- callbacks;
- notifications;
- navigation;
- form/server error setters;
- other UI-result behavior.

They do **not** need to be pure repository functions.

Shared API payloads use synchronized `IAPI...` contracts.

Shared checker definitions may also be used to validate API data on both sides.

`IAPIData<_T>` is frontend helper infrastructure around Axios handling. It is **not** the backend response format.

---

## Backend API Infrastructure

Normal backend flow:

```text
HTTP request
      ↓
Router
      ↓
Middleware
      ↓
Controller
      ↓
Mongoose / backend logic
      ↓
Shared API response
```

API paths are centralized in shared constants.

Controllers may use Mongoose directly. There is no default service/repository layer.

On success, the backend returns the requested shared `IAPI...` payload.

On failure, errors pass through the centralized backend error system.

Mongoose documents must be serialized into the shared application/API representation before being returned.

Backend request payloads can use the shared `TAPIChecker` / `checkApi` infrastructure for runtime validation.

---

## Frontend Component Example

Reusable frontend components use the `C...` prefix.

Typical structure:

```tsx
import { useMemo } from "react";
import type { GCompProps } from "...";
import { CExampleStyle } from ".../CExampleStyle";

interface CExampleProps extends GCompProps {
	value: string;
}

function CExample({ value, sx }: CExampleProps): React.ReactNode {
	//DATA
	const style = useMemo(() => {
		return CExampleStyle({});
	}, []);

	return <Box sx={sxMerger(style.root, sx)}>{value}</Box>;
}

export default CExample;
```

Main points:

- component names start with `C`;
- props use `CExampleProps`, not `ICExampleProps`;
- components normally use function declarations;
- props are normally destructured in the signature;
- reusable component props inherit `GCompProps` where appropriate;
- explicit return types are preferred for named functions when practical;
- caller/page `sx` overrides should retain final priority;
- internal order follows `DATA → FUNCTIONS → EFFECT → NODES → return` when those sections are needed.

Direct MUI layout primitives such as `Box`, `Stack`, and `Grid` are allowed.

Other MUI functionality should normally be exposed through project/RGT wrappers rather than used directly throughout feature code.

---

## Frontend Style Example

Reusable components normally get a dedicated style file **even if it starts empty**.

Example pair:

```text
CExample.tsx
CExampleStyle.ts
```

Typical style file:

```ts
import type { SxProps, Theme } from "@mui/material";

export interface CExampleStyleProps {}

interface CExampleStyleRtn {
	root: SxProps<Theme>;
}

export function CExampleStyle({}: CExampleStyleProps): CExampleStyleRtn {
	return {
		root: {},
	};
}
```

And inside the component:

```ts
const style = useMemo(() => {
	return CExampleStyle({});
}, []);
```

Visual styling belongs in the style file.

Inline `sx` is mainly for simple layout, size, and position concerns when a dedicated style object is not already handling that component.

When a component already has a style object, merge caller overrides after the component style.

Pages do **not** automatically require their own style file. Add one when the page actually needs it.

---

## Critical Warnings

> [!CAUTION]
> `make dev clean` currently removes **all Docker images and volumes on the host**, not only GameTool resources.

> [!CAUTION]
> `make sync up/down` uses `rsync --delete`. Verify the synchronization direction before running it.

> [!IMPORTANT]
> A populated `.env` is private/local configuration. It is intentionally synchronized by the RGT workflow but must never be committed to Git or distributed as normal project source.

> [!IMPORTANT]
> Generated output such as `dist/` is not source code and must not be manually edited.

> [!IMPORTANT]
> Synchronized backend contract/constants files are generated from frontend sources and should not be edited as authoritative files.

Security-sensitive follow-up items that are accepted for development but should be reviewed before production belong in:

```text
.info/SecurityConcerns.md
```

Technical implementation follow-up tasks that do not belong in the product roadmap belong in:

```text
todo.md
```

---

## Before Finishing / Pushing

For every modified frontend/backend side, enter the relevant Docker container and run:

```bash
npm run format
npm run lint
npm run build
```

Run **all three**.

Before pushing:

1. make sure shared frontend/backend contracts are synchronized;
2. verify every modified side passes validation;
3. never commit a populated `.env`;
4. commit and push the project normally.

---

## Backend Module Pattern

Backend functionality is organized by **module/domain**.

A typical simple database-backed module is:

```text
module/
├── controller.ts
├── router.ts
└── schema.ts
```

Not every module needs every file.

Do not introduce extra service/repository layers unless the module genuinely requires them.

Controller/action names should normally use:

```text
<module><Action>
```

Examples:

```text
projectGet
projectModify
groupCreate
groupEdit
groupDelete
```

Prefer a descriptive action over naming a function only after the HTTP verb.

Mongoose naming:

```text
projectSchema
→ local/private schema

SProject
→ exported/shared schema

MProject
→ exported model
```

Prefixes are mainly useful where the identifier crosses file/module boundaries or the category would otherwise be ambiguous.

---

## Documentation Reference

For more detail:

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | Project overview and main documentation index. |
| [`Roadmap.md`](./Roadmap.md) | Product-development roadmap and feature progression. |
| [`todo.md`](./todo.md) | Technical implementation tasks and follow-up work. |
| [`Architecture.md`](./.info/Architecture.md) | High-level repository and system architecture. |
| [`GettingStarted.md`](./.info/GettingStarted.md) | Setup and day-to-day development commands. |
| [`Frontend.md`](./.info/Frontend.md) | Frontend structure and architecture. |
| [`Backend.md`](./.info/Backend.md) | Backend structure and architecture. |
| [`RGT.md`](./.info/RGT.md) | RGT ownership, bootstrap, and synchronization. |
| [`SecurityConcerns.md`](./.info/SecurityConcerns.md) | Security concerns and production follow-up items. |
| [`SharedConventions.md`](./.info/SharedConventions.md) | Shared coding conventions. |
| [`FrontendConventions.md`](./.info/FrontendConventions.md) | Frontend-specific coding conventions. |
| [`BackendConventions.md`](./.info/BackendConventions.md) | Backend-specific coding conventions. |
