# Getting Started

> Practical setup and day-to-day development commands for Game Tool.

## Table of contents

- [Requirements](#requirements)
- [Environment setup](#environment-setup)
  - [Create `.env`](#create-env)
  - [Local directories](#local-directories)
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
- Git.

The project uses **npm** inside the frontend and backend development containers.

---

## Environment setup

### Create `.env`

Create the root `.env` file from the provided template:

```bash
cp default_env .env
```

Then fill in the required local values.

When a new environment variable is introduced, it should normally also be added to `default_env` with a safe, empty, or default value.

Do not commit secrets.

### Local directories

Make sure the local paths configured in `.env` exist where required, especially database/upload locations used by Docker.

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

Project RGT → shared RGT repository:

```bash
make sync up
```

Shared RGT repository → project RGT:

```bash
make sync down
```

RGT synchronization uses `rsync --delete`.

It is synchronization, not merge.

---

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
