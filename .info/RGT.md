# RGT

> Shared cross-project infrastructure, bootstrap baseline, and synchronization workflow used by GameTool and other RGT applications.

## Table of contents

- [Overview](#overview)
- [Ownership](#ownership)
  - [What belongs in `rgt/`](#what-belongs-in-rgt)
  - [What belongs in `src/`](#what-belongs-in-src)
  - [Dependency direction](#dependency-direction)
  - [Moving code into RGT](#moving-code-into-rgt)
- [Project integration](#project-integration)
  - [Frontend RGT](#frontend-rgt)
  - [Backend RGT](#backend-rgt)
  - [Guaranteed project files](#guaranteed-project-files)
- [RGT synchronization](#rgt-synchronization)
  - [`.system`](#system)
  - [Environment variables](#environment-variables)
  - [`make sync up`](#make-sync-up)
  - [`make sync down`](#make-sync-down)
  - [Synchronized baseline](#synchronized-baseline)
  - [`rsync --delete`](#rsync---delete)
- [Shared contracts](#shared-contracts)
  - [`.system/share.sh`](#systemsharesh)
  - [Frontend as source of truth](#frontend-as-source-of-truth)
  - [Synchronized content](#synchronized-content)
  - [Backend transformations](#backend-transformations)
- [Project defaults](#project-defaults)
- [Shared users across RGT applications](#shared-users-across-rgt-applications)
- [Workflow](#workflow)
  - [Editing RGT](#editing-rgt)
  - [Propagating changes](#propagating-changes)
  - [Pulling shared changes](#pulling-shared-changes)
- [Related documentation](#related-documentation)

---
## Overview

RGT is the reusable infrastructure layer shared between GameTool and other applications.

The code layer lives in:

```text
frontend/rgt/
backend/rgt/
```

The RGT system also includes the `.system/` bootstrap/synchronization infrastructure and a saved shared project baseline.

The purpose is practical: a new RGT application should not require rebuilding the entire development environment and common infrastructure from zero.

Two synchronization systems must remain conceptually separate:

```text
make sync up/down
shared project/RGT baseline synchronization
```

```text
make share
frontend-authoritative contracts → backend generated copies
```

## Ownership

### What belongs in `rgt/`

Use `rgt/` for code that is genuinely reusable across projects.

Examples include reusable:

- frontend components;
- hooks;
- contexts;
- API helpers;
- backend middleware;
- backend modules;
- database infrastructure;
- utilities;
- shared types;
- shared styling infrastructure.

When something is reusable, **RGT has priority**.

### What belongs in `src/`

Use `src/` for code that is specific to Game Tool.

Examples include:

- Game Tool pages;
- project-specific domain logic;
- project-specific backend modules;
- project-specific UI;
- project-specific constants;
- integrations that only make sense for this application.

The same folder type may exist in both `rgt/` and `src/`.

Ownership determines the location.

### Dependency direction

The normal dependency direction is:

```text
src
 ↓
rgt
```

Project-specific code can depend on reusable RGT infrastructure.

RGT must not import arbitrary project-specific `src/` code.

Do not move project-specific code into RGT merely to avoid an import-direction problem.

### Moving code into RGT

Ownership can change over time.

If code starts in `src/` but later becomes genuinely reusable, it should be moved into `rgt/`.

Do not leave reusable infrastructure in `src/` only because that is where it was first written.

The move must not introduce arbitrary dependencies back into project-specific code.

---

## Project integration

### Frontend RGT

Frontend reusable infrastructure lives under:

```text
frontend/rgt/
```

This can include:

- reusable components;
- contexts;
- hooks;
- API helpers;
- styles;
- utilities;
- shared contracts.

### Backend RGT

Backend reusable infrastructure lives under:

```text
backend/rgt/
```

This can include:

- middleware;
- reusable modules;
- database infrastructure;
- backend utilities;
- shared contracts;
- reusable constants.

### Guaranteed project files

RGT may depend on a small number of project-owned integration files when the RGT baseline guarantees their existence.

Current important examples include:

```text
frontend/src/style/theme.ts
frontend/src/consts.ts
backend/src/backendConsts.ts
backend/src/link/user.ts
synchronized project constants/contracts
```

`backend/src/link/user.ts` is an intentional extension hook used by the reusable user schema.

The global RGT user is shared between applications, while an application may need additional application-specific user data. The hook gives the application a place to create/link that data.

The hook must exist even when empty.

It is called from the shared user `pre("save")` lifecycle, so project/application-specific implementations should be safe to call repeatedly.

These integration points do **not** allow RGT to import arbitrary `src/` modules.

## RGT synchronization

### `.system`

`.system/` contains the infrastructure used to initialize and synchronize RGT-based applications.

Important scripts:

```text
.system/manage.sh
.system/init.sh
.system/sync.sh
.system/share.sh
```

### Environment variables

Synchronization uses:

```text
SYSTEM_SYNC_PROJECT_LOCATION
SYSTEM_SYNC_SAVE_LOCATION
```

The locations represent the active project baseline and the saved/shared baseline.

### `make sync up`

```bash
make sync up
```

Copies the active project baseline toward the saved/shared location.

### `make sync down`

```bash
make sync down
```

Copies the saved/shared baseline toward the active project.

### Synchronized baseline

The synchronization is intentionally broader than only `rgt/`.

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

It also adds top-level files from:

```text
frontend/
backend/
```

except:

```text
package.json
package-lock.json
```

This allows shared development configuration such as Dockerfiles, init scripts, TypeScript configuration, ESLint configuration, Prettier configuration, and Vite configuration to move with the RGT baseline while package manifests remain project-owned.

`.env` is intentionally synchronized as part of this private/local RGT workflow. It must remain excluded from Git and must not be treated as a shareable source file.

### `rsync --delete`

> [!WARNING]
> Synchronization uses `rsync --delete`.

This is **not a merge**.

A destination-only file can be removed when it is absent from the selected source. Verify the direction before running the command.

## Shared contracts

### `.system/share.sh`

`make share` synchronizes frontend-authoritative contracts/constants to backend-compatible generated copies.

It is separate from `make sync up/down`.

### Frontend as source of truth

When a synchronized type, API contract, icon-key contract, or shared constant changes, edit the frontend source.

Do not manually maintain the generated backend copy.

### Synchronized content

Current synchronization includes:

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

### Backend transformations

`.system/share.sh` currently:

- removes React-only type imports;
- converts `ReactNode` to `string`;
- adds `.js` to relative backend imports;
- adapts synchronized constant syntax;
- generates the backend `TIconLibrary` from the keys of the frontend icon library.

The backend result is generated output, not an independent source of truth.

## Project defaults

`.system/defaults/` and `.system/init.sh` provide the starting baseline for a new RGT application.

The initialization system is active and intentional.

Its purpose is to create enough of the expected project-owned structure for RGT to operate without manually rebuilding every common file.

The defaults are maintained pragmatically. They can temporarily lag behind the newest RGT requirements until a new application is initialized and a missing dependency/file/configuration is discovered.

When a new RGT application is started, run the initializer, fix the baseline where it breaks, and propagate the corrected baseline for future projects.

Package manifests are intentionally not part of normal `make sync up/down`, so initialization/default package manifests remain important for bringing a new project up to a usable dependency baseline.

## Shared users across RGT applications

The user account system is RGT-level infrastructure.

The intended long-term deployment uses one shared MongoDB infrastructure and one shared users database across RGT applications.

Consequences:

- a user has one global account/password across applications;
- global user validation rules must stay aligned across applications;
- application-specific information must live outside the global user document;
- global user assets such as avatars are part of the shared RGT user infrastructure;
- `backend/src/link/user.ts` exists so each application can create/link its own user representation.

Current refresh tokens are stored directly on the shared user document. Application-scoping of shared-user sessions is tracked as a production task in the root `todo.md`.

---

## Workflow

### Editing RGT

Normal contributor workflow:

```text
1. Work inside the Game Tool repository.
2. Edit frontend/rgt or backend/rgt directly.
3. Validate the affected project side normally.
4. Keep project-specific code in src.
```

There is no need to edit the central RGT repository separately during normal Game Tool development.

### Propagating changes

When reusable RGT changes are ready:

```bash
make sync up
```

This propagates the selected project/shared baseline to the saved RGT baseline.

### Pulling shared changes

When shared RGT has changed elsewhere:

```bash
make sync down
```

This updates the project/shared baseline from the saved RGT baseline.

Because synchronization uses `--delete`, make sure the chosen direction is correct before running it.

---

## Related documentation

- [`Architecture.md`](./Architecture.md) — repository-level architecture and ownership boundaries.
- [`Frontend.md`](./Frontend.md) — frontend structure.
- [`Backend.md`](./Backend.md) — backend structure.
- [`GettingStarted.md`](./GettingStarted.md) — day-to-day development commands.
- [`SharedConventions.md`](./SharedConventions.md) — shared coding conventions.
- [`SecurityConcerns.md`](./SecurityConcerns.md) — security follow-up items.
