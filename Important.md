# Important

> Quick reference for the parts of Game Tool that should be understood before working on the project.

## Table of contents

- [Start / Main Commands](#start--main-commands)
- [`rgt/` vs `src/`](#rgt-vs-src)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
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
make dev re
make dev red
make share
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
→ reusable cross-project code

src/
→ Game Tool-specific code
```

When something is genuinely reusable, **prefer RGT**.

Normal dependency direction:

```text
src
 ↓
rgt
```

RGT must not import arbitrary project-specific `src` code.

If code starts in `src/` and later becomes genuinely reusable, move it into `rgt/`.

Do not move project-specific code into RGT merely to solve an import problem.

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

The frontend copy of shared contracts and constants is authoritative.

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
| `modules/` | Backend functionality grouped by domain. |
| `types/` | Backend and synchronized shared types. |
| `util/` | Reusable backend utilities. |
| `backendConsts.ts` | Backend-only constants. |
| `src/index.ts` | Backend application entry point. |

The backend consumes synchronized copies of shared frontend contracts.

---

## Shared Contracts & Automatic Synchronization

The **frontend is the source of truth** for shared frontend/backend contracts.

Main synchronized areas:

```text
frontend/src/types/api
    → backend/src/types/api

frontend/src/types/data
    → backend/src/types/data

frontend/rgt/types/api
    → backend/rgt/types/api

frontend/rgt/types/data
    → backend/rgt/types/data
```

Shared project and RGT constants are synchronized as well.

Synchronization is handled by:

```text
share.sh
```

Its purpose is to keep frontend and backend API/data contracts identical without manually maintaining two copies.

The script also performs backend-specific transformations when required, such as:

- removing React/frontend-only dependencies;
- adapting imports for backend `.js` paths.

The normal Makefile development/build flow performs sharing before building.

> [!IMPORTANT]
> Backend synchronized copies are generated copies.  
> Do not edit them expecting the changes to survive. Modify the frontend source of truth.

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

Shared API payloads use the synchronized `IAPI...` contracts.

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

---

## Frontend Component Example

Reusable frontend components use the `C...` prefix.

Typical structure:

```tsx
import { useMemo } from "react";
import type { GCompProps } from "...";
import { CExampleStyle } from ".../CExampleStyle";

export interface CExampleProps extends GCompProps {
	value: string;
}

function CExample({ value, ...other }: CExampleProps) {
	//DATA
	const style = useMemo(() => {
		return CExampleStyle({});
	}, []);

	return (
		<div {...other} style={style.root}>
			{value}
		</div>
	);
}

export default CExample;
```

Main points:

- component name starts with `C`;
- props use `CExampleProps`, not `ICExampleProps`;
- component uses `function CExample(...)`;
- props are normally destructured in the signature;
- reusable component props inherit `GCompProps` where appropriate;
- internal order follows `DATA → FUNCTIONS → EFFECT → NODES → return` when those sections are needed.

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
export interface CExampleStyleProps {}

export function CExampleStyle({}: CExampleStyleProps) {
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

Inline `sx` is mainly for simple layout concerns when a dedicated style object is not already handling that component.

Pages do **not** automatically require their own style file. Add one when the page actually needs it.

---

## Critical Warnings

> [!CAUTION]
> `make dev clean` currently removes **all Docker images and volumes on the host**, not only Game Tool resources.

> [!IMPORTANT]
> Generated output such as `dist/` is not source code and must not be manually edited.

> [!IMPORTANT]
> Synchronized backend contract/constants files are generated from frontend sources and should not be edited as authoritative files.

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
3. commit and push the project normally.

---

## Backend Module Pattern

A typical simple database-backed backend module is:

```text
module/
├── controller.ts
├── router.ts
└── schema.ts
```

Not every module needs every file.

Do not introduce extra service/repository layers unless the module genuinely requires them.

---

## Documentation Reference

For more detail:

| Document | Purpose |
|---|---|
| [`README.md`](./README.md) | Project overview and main documentation index. |
| [`Architecture.md`](./.info/Architecture.md) | High-level repository and system architecture. |
| [`GettingStarted.md`](./.info/GettingStarted.md) | Setup and day-to-day development commands. |
| [`Frontend.md`](./.info/Frontend.md) | Frontend structure and architecture. |
| [`Backend.md`](./.info/Backend.md) | Backend structure and architecture. |
| [`RGT.md`](./.info/RGT.md) | RGT ownership and synchronization. |
| [`SharedConventions.md`](./.info/SharedConventions.md) | Shared coding conventions. |
| [`FrontendConventions.md`](./.info/FrontendConventions.md) | Frontend-specific coding conventions. |
| [`BackendConventions.md`](./.info/BackendConventions.md) | Backend-specific coding conventions. |
