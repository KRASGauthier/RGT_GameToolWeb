# Game Tool

> **A full-stack utility application for managing game projects, production, assets, source structure, and game data from one place.**

---

## Table of contents

- [Overview](#overview)
- [Documentation](#documentation)
- [Main Features](#main-features)
- [Project Status](#project-status)
- [Project Structure](#project-structure)
- [Development](#development)
- [Important Project Principles](#important-project-principles)

## Overview

### Purpose

**Game Tool** is designed to centralize the tools and information needed to develop and maintain a video game project.

The goal is to replace scattered spreadsheets, disconnected project-management tools, manually maintained references, and difficult-to-edit game data with a single application built specifically around game-development workflows.

It is intended to cover both:

- **production and project management**;
- **technical code and game-data management**.

The application is designed to support **multiple users, teams, and projects**.

### Scope

Game Tool is built around several major areas:

- project and team management;
- tasks, bugs, milestones, and roadmaps;
- asset tracking and provenance;
- source-code structure visualization;
- structured game-data creation and editing;
- synchronization with the game repository;
- validation and conflict detection.

---

## Documentation

### Start Here

| Document | Purpose |
|---|---|
| [`Important.md`](./Important.md) | Quick reference for starting the project, structure, shared contracts, API infrastructure, component/style patterns, and finishing work. |
| [`GettingStarted.md`](./.info/GettingStarted.md) | Setup, main development commands, services, validation, and destructive-command warnings. |

### Architecture

| Document | Purpose |
|---|---|
| [`Architecture.md`](./.info/Architecture.md) | High-level repository architecture and relationships between the main systems. |
| [`Frontend.md`](./.info/Frontend.md) | Frontend structure, folders, application architecture, shared contracts, and development flow. |
| [`Backend.md`](./.info/Backend.md) | Backend structure, modules, request flow, database architecture, contracts, and development flow. |
| [`RGT.md`](./.info/RGT.md) | Shared RGT ownership, integration, defaults, and synchronization infrastructure. |

### Conventions

| Document | Purpose |
|---|---|
| [`SharedConventions.md`](./.info/SharedConventions.md) | Naming, TypeScript, imports, control flow, code organization, and other shared conventions. |
| [`FrontendConventions.md`](./.info/FrontendConventions.md) | Components, styling, React, MUI, frontend API, forms, and frontend validation conventions. |
| [`BackendConventions.md`](./.info/BackendConventions.md) | Backend modules, Mongoose, constants, middleware, errors, logging, API, and validation conventions. |

---

## Main Features

### Project Management

Each user has a personal home area from which they can access and manage multiple projects.

Planned project-management features include:

- user account and personal settings;
- project creation and selection;
- project configuration;
- team and member management;
- to-do and task management;
- bug tracking;
- bug details, references, and images;
- project roadmaps;
- milestones and development targets.

### Asset Management

The asset manager maintains a registry of assets used by the game and records where they came from.

A major purpose is to ensure that temporary or legally restricted assets remain visible throughout development.

Assets can be tracked using information such as:

- source and origin;
- licensing status;
- placeholder status;
- AI-generated status;
- commercial-use eligibility;
- replacement requirement before release.

The objective is to avoid reaching release with forgotten placeholders or assets that cannot legally ship.

### Code Manager

The code manager will analyze the game project's source code and build a structured representation of it.

This representation may include:

- classes and structures;
- inheritance;
- includes and dependencies;
- available properties and data types;
- relationships between game systems.

Its purpose is not to replace the source code itself, but to provide a clearer overview of the technical structure of the game and make inconsistencies easier to identify.

### Data Registry

The data registry will use the structures discovered by the code manager to provide a dedicated editor for game data.

Instead of maintaining large spreadsheets or manually editing large amounts of data through the game engine, Game Tool will allow data entries to be created from parsed code structures.

Examples include:

- items;
- interactable objects;
- pickable objects;
- loot tables;
- resources;
- ranges and configurable values;
- references between registry entries.

The registry should remain consistent with the structures defined by the game code.

### Repository Synchronization

Because the application runs through a server and cannot directly access each user's local game-project folder, the intended synchronization layer is the project's **Git repository**.

The general workflow is expected to be:

```text
Git repository
      ↓
Backend checkout / pull
      ↓
Code and data parsing
      ↓
Game Tool registry editing
      ↓
Generated game data
      ↓
Commit / push
```

This gives Game Tool controlled access to the current project state without requiring users to manually copy data between the application and the game engine.

### Validation & Conflict Detection

When the source-code structure changes, existing data may no longer match it.

Game Tool is intended to detect structural conflicts such as:

- removed fields;
- renamed or unknown fields;
- field type changes;
- removed classes or structures;
- inheritance changes;
- broken references;
- existing registry entries that no longer conform to the parsed code.

A later goal is to add higher-level analysis capable of detecting suspicious, inconsistent, or potentially unbalanced game data.

---

## Project Status

Game Tool is currently under active development.

The current focus is establishing the application foundation and project-management layer before progressing into the code manager, data registry, synchronization, and analysis systems.

## Project Structure

At a high level, the repository is organized around:

```text
frontend/
backend/
.system/
.info/
README.md
Important.md
```

### `src/` vs `rgt/`

Both frontend and backend contain `src/` and `rgt/` structures.

| Folder | Ownership |
|---|---|
| `rgt/` | Shared, reusable cross-project infrastructure and code. |
| `src/` | Game Tool-specific application code. |

Reusable code should generally prefer `rgt/`.

Project-specific code belongs in `src/`.

Code may move from `src/` to `rgt/` later when it becomes genuinely reusable.

---

## Development

The project is currently developed using:

- **TypeScript**
- **React**
- **Vite**
- **MUI / Emotion**
- **Node.js**
- **Express**
- **MongoDB / Mongoose**
- **Docker**
- **npm**
- **Make**

The development environment is Docker-based.

Use the **Makefile** as the normal command interface whenever an equivalent command exists.

Common entry points include:

```bash
make dev run
make dev rund
make dev down
make share
make help
```

Detailed setup and environment information belongs in:

**[`GettingStarted.md`](./.info/GettingStarted.md)**

---

## Important Project Principles

Before working on the codebase, read:

**[`Important.md`](./Important.md)**

It contains the compact operational reference for:

- starting and stopping the project;
- `rgt/` vs `src/`;
- frontend and backend structure;
- shared contract synchronization;
- frontend/backend API infrastructure;
- standard component and style patterns;
- validation before pushing;
- critical destructive-command warnings.

> [!CAUTION]
> `make dev clean` currently removes **all Docker images and volumes on the host**, not only resources belonging to this project.
