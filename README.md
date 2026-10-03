# GameTool

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

**GameTool** is designed to centralize the tools and information needed to develop and maintain a video game project.

The goal is to replace scattered spreadsheets, disconnected project-management tools, manually maintained references, difficult-to-edit game data, and hardcoded project information with a single application built specifically around game-development workflows.

It is intended to cover both:

- **production and project management**;
- **game data, assets, and technical project information**.

The application is designed to support **multiple users, teams, and projects**.

### Scope

GameTool is built around several major areas:

- project and team management;
- tasks, bugs, milestones, and roadmaps;
- asset tracking and provenance;
- configurable game-data registries;
- source-code structure visualization;
- structured data validation and analysis;
- machine-readable data export;
- synchronization with the game repository;
- consistency and conflict detection.

---

## Documentation

### Start Here

| Document | Purpose |
|---|---|
| [`Important.md`](./Important.md) | Quick reference for starting the project, structure, shared contracts, API infrastructure, component/style patterns, and finishing work. |
| [`Roadmap.md`](./Roadmap.md) | Current development roadmap and planned progression of the project. |
| [`todo.md`](./todo.md) | Technical implementation tasks and follow-up work that do not belong in the product roadmap. |
| [`GettingStarted.md`](./.info/GettingStarted.md) | Setup, main development commands, services, validation, and destructive-command warnings. |

### Architecture

| Document | Purpose |
|---|---|
| [`Architecture.md`](./.info/Architecture.md) | High-level repository architecture and relationships between the main systems. |
| [`Frontend.md`](./.info/Frontend.md) | Frontend structure, folders, application architecture, shared contracts, and development flow. |
| [`Backend.md`](./.info/Backend.md) | Backend structure, modules, request flow, database architecture, contracts, and development flow. |
| [`RGT.md`](./.info/RGT.md) | Shared RGT ownership, integration, defaults, and synchronization infrastructure. |
| [`SecurityConcerns.md`](./.info/SecurityConcerns.md) | Security-sensitive behavior, known concerns, and items that should be reviewed before production. |

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

### Data Registry

The Registry is one of GameTool's core data-management systems.

Instead of hardcoding every game element directly into the game or maintaining large amounts of structured data inside spreadsheets or the game engine, developers can define and manage entries through configurable registries.

A registry can represent project-defined structured data such as:

- items;
- entities;
- abilities;
- statistics;
- resources;
- interactable objects;
- loot tables;
- ranges and configurable values;
- references between registry entries;
- other project-specific game data.

Registry entries can be created, organized, edited, searched, compared, validated, and balanced through a dedicated interface.

Registries are intended to be exported into **machine-readable data**, initially using **JSON**.

The game or another application can then load and interpret the exported data independently, allowing GameTool to act as an external data-authoring and balancing environment.

The Registry is not dependent on the Code Manager. Code analysis may later provide additional structure detection, synchronization, validation, or automation for registries when appropriate.

### Asset Management

The asset manager maintains organized information about assets used by the project and records where they came from.

A major purpose is to ensure that temporary or legally restricted assets remain visible throughout development.

Assets can be tracked using information such as:

- source and origin;
- licensing status;
- placeholder status;
- AI-generated status;
- commercial-use eligibility;
- replacement requirement before release.

The objective is to avoid reaching release with forgotten placeholders or assets that cannot legally ship.

The asset-management system is also intended to make project resources easier to inspect and manage than when their information is distributed throughout the game engine or project files.

### Code Manager

The Code Manager will analyze the game project's source code and build a structured representation of it.

This representation may include:

- classes and structures;
- inheritance;
- includes and dependencies;
- available properties and data types;
- relationships between game systems.

Its purpose is not to replace the source code itself, but to provide a clearer overview of the technical structure of the game and make inconsistencies easier to identify.

The information discovered by the Code Manager may also be used by other GameTool systems for validation, visualization, synchronization, or registry integration.

### Repository Synchronization

Because the application runs through a server and cannot directly access each user's local game-project folder, the intended synchronization layer is the project's **Git repository**.

The general workflow is expected to be:

```text
Git repository
      ↓
Backend checkout / pull
      ↓
Code and project-data parsing
      ↓
GameTool editing and management
      ↓
Generated / exported project data
      ↓
Commit / push
```

This gives GameTool controlled access to the current project state without requiring users to manually copy data between the application and the game engine.

### Validation, Analysis & Conflict Detection

GameTool is intended to provide validation tools for detecting invalid, inconsistent, or conflicting project data.

Structural validation may include:

- removed fields;
- renamed or unknown fields;
- field type changes;
- removed classes or structures;
- inheritance changes;
- broken references;
- registry entries that no longer match their expected structures;
- inconsistent relationships between entries.

Registry-specific analysis may later include:

- configurable consistency checks;
- comparisons between registry entries;
- automatic detection of suspicious values;
- balance analysis based on configurable parameters;
- detection of potentially unbalanced or anomalous game data.

These systems are intended to detect potential problems before they reach the game.

---

## Project Status

GameTool is currently under active development.

The current focus is establishing the application foundation and project-management systems before progressively expanding into asset management, source-code analysis, registries, synchronization, export, validation, and data-analysis systems.

The planned development progression is documented in:

**[`Roadmap.md`](./Roadmap.md)**

## Project Structure

At a high level, the repository is organized around:

```text
frontend/
backend/
.system/
.info/
README.md
Important.md
Roadmap.md
todo.md
```

### `src/` vs `rgt/`

Both frontend and backend contain `src/` and `rgt/` structures.

| Folder | Ownership |
|---|---|
| `rgt/` | Shared, reusable cross-project infrastructure and code. |
| `src/` | GameTool-specific application code. |

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
