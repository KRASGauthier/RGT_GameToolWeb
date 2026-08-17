# RGT

> Shared cross-project infrastructure used by Game Tool and the workflow for synchronizing it with the central RGT repository.

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
  - [`rsync --delete`](#rsync---delete)
- [Shared contracts](#shared-contracts)
  - [`share.sh`](#sharesh)
  - [Frontend as source of truth](#frontend-as-source-of-truth)
  - [Synchronized content](#synchronized-content)
  - [Backend transformations](#backend-transformations)
- [Project defaults](#project-defaults)
- [Workflow](#workflow)
  - [Editing RGT](#editing-rgt)
  - [Propagating changes](#propagating-changes)
  - [Pulling shared changes](#pulling-shared-changes)
- [Related documentation](#related-documentation)

---

## Overview

RGT is the reusable infrastructure layer shared between Game Tool and other projects.

Both frontend and backend contain an RGT tree:

```text
frontend/rgt/
backend/rgt/
```

Game Tool keeps a working copy of RGT inside the project repository.

Collaborators normally edit that project copy directly. Changes can later be propagated to the central shared RGT repository.

RGT synchronization and frontend/backend contract synchronization are two separate systems.

---

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

A small number of project files are guaranteed by the project bootstrap/default structure and may intentionally be consumed by RGT.

Important examples include:

```text
frontend/src/style/theme.ts
frontend/src/consts.ts
backend/src/backendConsts.ts
synchronized constants and contracts
```

These are explicit integration points.

They do not allow RGT to freely depend on arbitrary `src/` files.

---

## RGT synchronization

### `.system`

`.system/` contains the infrastructure used to initialize and synchronize RGT-based projects.

It includes synchronization scripts and project defaults.

This system is separate from normal application feature code.

### Environment variables

RGT synchronization uses:

```text
SYSTEM_SYNC_PROJECT_LOCATION
SYSTEM_SYNC_SAVE_LOCATION
```

These define the relevant project and shared RGT locations used by the synchronization scripts.

### `make sync up`

Push the project RGT copy to the shared RGT repository:

```bash
make sync up
```

Direction:

```text
Game Tool RGT
      ↓
Shared RGT repository
```

Use this after project-side RGT changes are ready to be propagated.

### `make sync down`

Pull the shared RGT repository into the project:

```bash
make sync down
```

Direction:

```text
Shared RGT repository
      ↓
Game Tool RGT
```

Use this when the project needs the current shared RGT version.

### `rsync --delete`

> [!WARNING]
> RGT synchronization uses `rsync --delete`.

Synchronization is **not a merge**.

If a file exists only on the destination side, synchronization can remove it.

Always treat the chosen synchronization direction as authoritative for that operation.

---

## Shared contracts

### `share.sh`

`share.sh` synchronizes shared frontend/backend contracts.

It is **not part of RGT synchronization**.

The two systems solve different problems:

```text
RGT sync
Project RGT ↔ Shared RGT repository
```

```text
share.sh
Frontend contracts → Backend generated copies
```

### Frontend as source of truth

The frontend is authoritative for shared frontend/backend contracts.

When a synchronized API contract, data contract, or shared constant must change, modify the frontend source.

Do not modify the generated backend copy expecting the change to survive.

### Synchronized content

`share.sh` synchronizes approximately:

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

It also synchronizes:

```text
frontend project constants
    → backend equivalents

frontend RGT constants
    → backend equivalents
```

### Backend transformations

Backend copies are adapted as part of synchronization.

Transformations can include:

- removing React-specific imports;
- removing frontend-only types;
- converting import paths to backend-compatible `.js` paths.

The backend copy is therefore a generated backend representation of the frontend source, not an independently maintained contract.

---

## Project defaults

`.system/defaults` and related initialization files define the mandatory/default project baseline.

They ensure that RGT-based projects contain the files that shared infrastructure expects.

This is also what allows RGT to rely on a small number of guaranteed project integration files without treating arbitrary `src/` code as shared infrastructure.

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

This propagates the project RGT copy to the shared RGT repository.

### Pulling shared changes

When shared RGT has changed elsewhere:

```bash
make sync down
```

This updates the project copy from the shared repository.

Because synchronization uses `--delete`, make sure the chosen direction is correct before running it.

---

## Related documentation

- [`Architecture.md`](./Architecture.md) — repository-level architecture and ownership boundaries.
- [`Frontend.md`](./Frontend.md) — frontend structure.
- [`Backend.md`](./Backend.md) — backend structure.
- [`GettingStarted.md`](./GettingStarted.md) — day-to-day development commands.
- [`SharedConventions.md`](./SharedConventions.md) — shared coding conventions.
