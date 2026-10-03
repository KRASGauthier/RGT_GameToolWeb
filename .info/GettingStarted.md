# Getting Started

> Practical setup and day-to-day development commands for Game Tool.

## Table of contents

- [Requirements](#requirements)
- [Environment setup](#environment-setup)
  - [Create `.env`](#create-env)
  - [Local directories](#local-directories)
  - [RGT project initialization](#rgt-project-initialization)
- [Start the project](#start-the-project)
  - [Foreground](#foreground)
  - [Detached](#detached)
  - [Stop](#stop)
- [Development services](#development-services)
- [Main commands](#main-commands)
  - [Development](#development)
  - [Shared contracts](#shared-contracts)
  - [RGT synchronization](#rgt-synchronization)
- [Validation](#validation)
- [Destructive commands](#destructive-commands)
- [Help](#help)

---
## Requirements

Install:

- Docker;
- Docker Compose;
- Make;
- Git;
- a Bash-compatible shell with `rsync` for the `.system` synchronization scripts.

The project uses **npm** inside the frontend and backend development containers.

---

## Environment setup

### Create `.env`

Create the root `.env` from the template:

```bash
cp default_env .env
```

Fill in the local values required by your development environment.

The real `.env` contains environment-specific/private values and is not committed to Git.

JWT secrets are supplied directly through the real environment:

```text
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
```

Each developer/environment can use its own values because development databases/environments are independent.

Production secrets are expected to remain stable for that environment. Rotating them intentionally invalidates existing JWT sessions and effectively logs users out.

The RGT synchronization system intentionally includes `.env` so the private/local shared RGT baseline can carry the environment when desired. That does **not** make `.env` a Git/shared-public file.

### Local directories

Make sure the local paths configured in `.env` exist where required, especially database/upload locations used by Docker.

---

### RGT project initialization

The RGT bootstrap system is available through:

```bash
.system/manage.sh init <name> [fix]
```

It initializes a new RGT-based frontend/backend from `.system/defaults/`.

The defaults are maintained pragmatically. If initialization exposes an outdated default or missing dependency, fix the baseline as part of bringing that new project up rather than assuming the template is always perfect in isolation.

---

## Start the project

Use the Makefile as the normal project interface.

### Foreground

```bash
make dev run
```

This builds the development environment and starts it in the foreground.

### Detached

```bash
make dev rund
```

This builds the development environment and starts it in detached mode.

### Stop

```bash
make dev down
```

---

## Development services

Default development access:

| Service | Address |
|---|---|
| Frontend | `http://localhost:8081` |
| Backend API | `http://localhost:8082` |
| Mongo Express | `http://localhost:8083` |

MongoDB is used internally by the Docker environment and is not normally exposed through a host port.

---

## Main commands

### Development

```bash
make dev build
make dev run
make dev rund
make dev down
make dev re
make dev red
make dev clean
make dev wipe
```

Build without Docker cache:

```bash
make dev build f
```

### Shared contracts

Synchronize frontend-authoritative shared contracts to the backend:

```bash
make share
```

The normal development build flow already performs sharing before building.

### RGT synchronization

Synchronize the active project/shared RGT baseline toward the saved baseline:

```bash
make sync up
```

Synchronize the saved baseline toward the active project:

```bash
make sync down
```

This synchronization is intentionally broader than only `frontend/rgt` and `backend/rgt`.

It includes `.system`, shared development configuration, RGT trees, and selected top-level frontend/backend files.

`package.json` and `package-lock.json` are excluded from normal sync.

`.env` is intentionally included in this private/local sync workflow but remains Git-ignored.

Synchronization uses `rsync --delete`.

It is synchronization, not merge.

## Validation

Before considering work complete, run the following **inside each modified frontend/backend Docker container**:

```bash
npm run format
npm run lint
npm run build
```

Run all three commands.

---

## Destructive commands

> [!CAUTION]
> The current cleanup commands are not scoped only to Game Tool.

`make dev clean` currently removes **all Docker images and volumes on the host** after bringing the development compose environment down.

```bash
make dev clean
```

`make dev wipe` performs the same cleanup and also prunes the Docker builder cache.

```bash
make dev wipe
```

The rebuild commands use that cleanup flow:

```bash
make dev re
make dev red
```

Use these commands only when that host-wide cleanup is intended.

---

## Help

Display the Makefile command help:

```bash
make help
```
