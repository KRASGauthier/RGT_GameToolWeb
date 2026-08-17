# Shared System and RGT

<!-- TOC START -->
## Table of contents

- [Purpose](#purpose)
- [RGT ownership decision](#rgt-ownership-decision)
- [The `.system` folder](#the-system-folder)
- [RGT repository synchronization](#rgt-repository-synchronization)
  - [Configuration](#configuration)
  - [Directions](#directions)
    - [Upload the current shared state](#upload-the-current-shared-state)
    - [Download the shared state](#download-the-shared-state)
  - [Current synchronization scope](#current-synchronization-scope)
  - [Collaborator expectation](#collaborator-expectation)
- [Frontend-to-backend contract sharing](#frontend-to-backend-contract-sharing)
  - [Critical rule](#critical-rule)
  - [Shared paths](#shared-paths)
  - [Why backend-only edits are unsafe](#why-backend-only-edits-are-unsafe)
    - [Correct workflow](#correct-workflow)
  - [Backend transformations](#backend-transformations)
  - [Automatic invocation](#automatic-invocation)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## Purpose

The repository contains infrastructure that belongs to a wider shared system called **RGT**.

RGT exists because several projects use the same development infrastructure. Keeping independent copies of files such as Docker configuration, Makefiles, initialization scripts, shared utilities, and RGT-specific code would require the same maintenance to be repeated across every repository.

Instead, the common infrastructure can be synchronized with a separate RGT repository. Project-specific code and shared infrastructure can therefore coexist in the same project without requiring each project to become the source of an independent copy of the shared system.

This distinction matters to both humans and coding agents: **not every file in this repository should be treated as project-specific architecture.**

---

## RGT ownership decision

For implementation code, ownership is based on reuse:

```text
genuinely reusable across RGT projects -> rgt/
project-specific implementation        -> src/
```

When code is genuinely reusable, RGT is the preferred location. If something starts in `src/` because it is project-specific and later evolves into reusable infrastructure, move it into `rgt/` when that ownership change becomes clear.

Do not move code into RGT merely because a broad concept could be reusable, and never move project-specific code into RGT just to avoid an import-direction problem. RGT must remain reusable and must not acquire arbitrary dependencies on project-specific `src` implementation.

---

## The `.system` folder

`.system/` contains scripts used to manage the shared infrastructure.

Current files include:

```text
.system/
├── init.sh
├── manage.sh
├── share.sh
├── shared.sh
└── sync.sh
```

Their responsibilities are different:

- `manage.sh` routes shared-system operations.
- `sync.sh` synchronizes RGT-managed files between this project and the configured shared repository location.
- `init.sh` initializes a new project from shared default files.
- `shared.sh` contains shell display/progress helpers used by system scripts.
- `share.sh` is different from RGT repository synchronization: it synchronizes shared TypeScript contracts from the frontend into the backend.

The last distinction is especially important. **RGT synchronization and frontend/backend contract sharing are separate mechanisms.**

---

# RGT repository synchronization

## Configuration

The synchronization locations are configured through the environment:

```text
SYSTEM_SYNC_PROJECT_LOCATION
SYSTEM_SYNC_SAVE_LOCATION
```

`SYSTEM_SYNC_PROJECT_LOCATION` identifies the current project's synchronized location.

`SYSTEM_SYNC_SAVE_LOCATION` identifies the external/shared RGT repository location used to carry the common infrastructure between projects.

Do not hard-code a developer's local paths in documentation or application code. The actual locations are environment-specific.

## Directions

### Upload the current shared state

```bash
make sync up
```

Conceptually:

```text
Current project
     |
     v
Shared RGT repository
```

### Download the shared state

```bash
make sync down
```

Conceptually:

```text
Shared RGT repository
     |
     v
Current project
```

The implementation uses `rsync` with deletion enabled for synchronized targets. This is synchronization, **not a source-code merge strategy**.

## Current synchronization scope

The current `sync.sh` includes the following shared targets:

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

It also adds root-level files found directly under `frontend/` and `backend/`, excluding:

```text
package.json
package-lock.json
```

The synchronization scope is defined by `.system/sync.sh`; contributors should inspect that script before assuming that a root-level infrastructure file is project-specific.

## Collaborator expectation

Ordinary collaborators are not expected to have access to the owner's central RGT repository.

They work on the copy present in this repository. If a shared-system modification is made here, the repository owner can later propagate it through the central RGT synchronization workflow.

Therefore:

> [!NOTE]
> A collaborator may modify RGT-managed files when the task genuinely requires it, but should not invent a separate synchronization workflow or assume access to the external RGT repository.

---

# Frontend-to-backend contract sharing

## Critical rule

> [!CAUTION]
> **For shared API types, data types, and constants, the frontend copy is authoritative. Do not make a backend-only change to these synchronized files.**

`.system/share.sh` copies shared TypeScript contracts from the frontend into the backend.

This allows frontend and backend to use matching contracts without maintaining two independent definitions. When a shared request/response payload belongs to `types/api/`, define it once in the authoritative frontend contract and consume the synchronized version on the backend rather than independently redefining the same payload on both sides.

## Shared paths

The current synchronization includes:

```text
frontend/src/types/api   -> backend/src/types/api
frontend/src/types/data  -> backend/src/types/data

frontend/rgt/types/api   -> backend/rgt/types/api
frontend/rgt/types/data  -> backend/rgt/types/data

frontend/src/consts      -> backend/src/consts
frontend/src/consts.ts   -> backend/src/consts.ts
frontend/rgt/consts.ts   -> backend/rgt/consts.ts
```

Some of these paths may not exist in every project at every stage. `share.sh` copies them when the frontend source exists.

## Why backend-only edits are unsafe

For synchronized directories, `share.sh` removes the backend destination before copying the frontend source again.

Conceptually:

```text
frontend shared definition
          |
          |  authoritative source
          v
   .system/share.sh
          |
          v
backend synchronized copy
```

A change made only in a synchronized backend directory can therefore disappear the next time sharing runs.

### Correct workflow

If an API contract must change:

```text
1. Change the shared frontend definition.
2. Run the sharing workflow.
3. Update frontend/backend implementation code that depends on the contract.
4. Validate both applications when both are affected.
```

Do **not** manually try to keep two authoritative versions in sync.

## Backend transformations

The backend copy is not always byte-for-byte identical to the frontend source.

After copying TypeScript files, `share.sh` performs backend-specific transformations, including:

- removing type-only imports from `react`;
- replacing `ReactNode` with `string`;
- adding `.js` to matching relative imports;
- transforming copied constants files for backend use.

This means the backend copy should be understood as a **derived backend-compatible representation**, not as an independent source from which the frontend should be reconstructed.

## Automatic invocation

The Makefile defines:

```text
dev_build -> share
```

and normal development run commands depend on `dev_build`.

As a result, the normal Makefile development workflow refreshes shared contracts before building the Docker development environment.

This is another reason backend-only changes to synchronized files are unsafe: launching the normal development workflow can overwrite them.

---

# Rules for contributors and agents

When modifying this area:

1. Determine whether the implementation is project-specific or genuinely reusable before restructuring it; prefer `rgt/` for reusable code and move code there when its ownership genuinely becomes cross-project.
2. Do not assume access to the external RGT repository.
3. Do not replace the RGT synchronization system with another mechanism unless explicitly requested.
4. Treat frontend shared types/constants as the source of truth for the paths handled by `share.sh`.
5. Do not make backend-only changes to synchronized contracts.
6. Do not remove backend transformations from `share.sh` simply because the generated files differ from the frontend copies.
7. Before introducing a second shared-contract mechanism, verify that the existing `share.sh` flow cannot support the requirement.
