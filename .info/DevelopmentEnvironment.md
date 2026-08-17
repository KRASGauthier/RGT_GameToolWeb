# Development Environment

<!-- TOC START -->
## Table of contents

- [Purpose](#purpose)
- [Makefile](#makefile)
  - [Development command router](#development-command-router)
  - [Shared-system commands](#shared-system-commands)
  - [Destructive command warning](#destructive-command-warning)
- [Docker development architecture](#docker-development-architecture)
  - [Development-only naming](#development-only-naming)
  - [Services](#services)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [MongoDB](#mongodb)
    - [Mongo Express](#mongo-express)
- [Package manager](#package-manager)
- [Source mounting and live development](#source-mounting-and-live-development)
- [Development ports](#development-ports)
- [Frontend/backend development relationship](#frontendbackend-development-relationship)
- [Environment configuration](#environment-configuration)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## Purpose

The current environment is intentionally optimized for **development**, not production deployment.

Docker is primarily used to provide consistent isolated runtime environments for the frontend, backend, MongoDB, and Mongo Express. The frontend and backend source trees remain available from the host through bind-mounted Docker volumes, allowing development watchers to react to normal source edits without rebuilding an application image every time a file changes.

---

# Makefile

The root `Makefile` is the main command entry point for the development environment and shared-system utilities. When the Makefile already exposes an operation, use that target rather than manually reproducing the underlying Docker/npm sequence. Lower-level commands remain appropriate for focused debugging, inspection, or validation work.

## Development command router

Development commands use the following form:

```bash
make dev <command> [argument]
```

Current commands are:

| Command | Current behavior |
| --- | --- |
| `make dev build` | Runs shared-contract synchronization, then builds the development Docker Compose services. |
| `make dev build f` | Same as build, but forces a Docker build with `--no-cache`. |
| `make dev run` | Builds first, then starts Docker Compose in the foreground. |
| `make dev rund` | Builds first, then starts Docker Compose in detached mode. |
| `make dev re` | Runs the current clean target, rebuilds, then starts in the foreground. |
| `make dev red` | Runs the current clean target, rebuilds, then starts detached. |
| `make dev down` | Stops the development Docker Compose environment. |
| `make dev clean` | Stops Compose, then removes Docker images and Docker volumes according to the current Makefile implementation. |
| `make dev wipe` | Runs `clean`, then prunes the Docker builder cache. |

The default Make target executes:

```bash
make dev run
```

## Shared-system commands

```bash
make share
make sync up
make sync down
make help
```

- `make share` calls `.system/share.sh`.
- `make sync up` and `make sync down` route through the RGT synchronization system.
- `make help` prints the Makefile command help.

See [System.md](System.md) for the distinction between `share` and `sync`.

## Destructive command warning

> [!CAUTION]
> **The current `make dev clean` implementation is host-wide, not project-scoped.**
>
> It currently attempts to remove all Docker images returned by `docker images -aq` and all Docker volumes returned by `docker volume ls -q`.
>
> Do not run `make dev clean`, `make dev re`, `make dev red`, or `make dev wipe` casually on a machine that contains Docker resources for other work.

`make dev wipe` is even broader because it also runs:

```text
docker builder prune -f
```

This documentation describes the current implementation. It does not imply that the behavior is ideal or permanent.

---

# Docker development architecture

## Development-only naming

The current Docker files use the `.dev` convention deliberately:

```text
docker-compose.dev.yaml
frontend/dockerfile.dev
backend/dockerfile.dev
frontend/init.dev.sh
backend/init.dev.sh
```

There is currently no production Docker architecture in this project.

> [!IMPORTANT]
> Do not interpret the absence of generic or production Dockerfiles as missing work that should be automatically filled in. Production packaging, static serving, and deployment behavior are separate future concerns.

## Services

The current development Compose environment contains four services:

```text
frontend
backend-node
mongo
mongo-express
```

### Frontend

The frontend image inherits from `node:24-alpine`.

Its development startup script enters `/home/app/`, installs dependencies, and launches the full Vite development server:

```text
npm install
npm run dev:full
```

### Backend

The backend image also inherits from `node:24-alpine`.

Its development startup script enters `/home/app/`, installs dependencies, and launches the TypeScript development watcher:

```text
npm install
npm run dev
```

### MongoDB

MongoDB uses the official `mongo:7` image and stores development database data through a configured host-backed Docker volume.

### Mongo Express

Mongo Express uses the standard `mongo-express` image and connects to the MongoDB service through the Docker development network.

---

# Package manager

Frontend and backend use **npm** as the project package manager. The committed `package-lock.json` files belong to that workflow and should remain the lockfile source of truth.

Do not introduce Yarn, pnpm, or another package manager/lockfile as an incidental change. Changing package manager is a deliberate project migration, not routine dependency work.

---

# Source mounting and live development

The frontend and backend `/home/app/` directories are backed by host project directories through Docker volumes configured as bind mounts.

Conceptually:

```text
Host source directory
        <->
Docker /home/app/
        |
        v
Development watcher
```

This is intentional.

Normal TypeScript/React/backend source modifications should be detected by the running development processes. Rebuilding the Docker image after every application code change is not the intended workflow.

Docker here provides the controlled environment; it is not currently being used as a production-style immutable application package.

---

# Development ports

The shared development convention is:

| Host endpoint | Purpose |
| --- | --- |
| `http://localhost:8081` | Frontend |
| `http://localhost:8082` | Backend / API |
| `http://localhost:8083` | Mongo Express |

In the current environment configuration:

```text
8081 -> frontend container port 5173
8082 -> backend container port 8080
8083 -> mongo-express container port 8081
```

MongoDB itself is used through the internal Docker network rather than being exposed through one of these public development ports.

These host port roles are intended to remain consistent across projects using this shared system.

---

# Frontend/backend development relationship

Frontend and backend are developed as a connected environment.

The frontend uses the actual backend exposed by the development setup. There is no separate frontend mock backend in the normal workflow.

A frontend feature that depends on an API contract should therefore be considered together with the real backend contract and implementation rather than being designed around a parallel mock contract.

---

# Environment configuration

`default_env` defines the expected environment-variable structure. Project-specific/local values belong in `.env`.

When a new environment variable is introduced, normally add the corresponding key to `default_env` as well, using a safe/default/empty value as appropriate. This keeps the expected configuration discoverable for another developer without committing the real local secret or machine-specific value.

Important groups currently include:

```text
COMMON
FRONTEND
BACKEND
DB
DEV
SYSTEM
```

The environment controls values such as:

- application name/tag;
- frontend and backend source locations;
- backend upload location;
- development database locations;
- development Docker network;
- Docker development filename;
- frontend/backend internal and external ports;
- RGT synchronization locations.

Do not copy machine-specific paths, credentials, tokens, or secrets into documentation.

---

# Rules for contributors and agents

1. Use the Makefile as the normal project command interface whenever an equivalent target exists; use lower-level Docker/npm commands only when the task specifically requires them.
2. Remember that normal `make dev` build/run flows invoke shared-contract synchronization.
3. Do not convert the current development Dockerfiles into production images as an unrelated cleanup.
4. Preserve bind-mounted source development unless an explicit architectural change is requested.
5. Do not introduce a frontend mock backend as a substitute for the current real backend without an explicit requirement.
6. Treat ports `8081`, `8082`, and `8083` according to their established development roles.
7. Be extremely careful with `clean`, `re`, `red`, and `wipe` because the current Makefile can remove Docker resources outside this project.
8. Use npm and preserve the committed `package-lock.json` workflow unless a package-manager migration is explicitly chosen.
9. When adding an environment variable, normally mirror its key in `default_env` without placing real secrets there.
