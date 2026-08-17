# Game Tool

<!-- TOC START -->
## Table of contents

- [About the project](#about-the-project)
- [Product structure](#product-structure)
  - [User home and projects](#user-home-and-projects)
  - [Project management](#project-management)
  - [Asset management](#asset-management)
  - [Code and data management](#code-and-data-management)
- [Planned code/data workflow](#planned-codedata-workflow)
- [Roadmap](#roadmap)
- [Start here](#start-here)
- [Core repository rules](#core-repository-rules)
- [Current development topology](#current-development-topology)
- [Documentation philosophy](#documentation-philosophy)
<!-- TOC END -->

## About the project

**Game Tool** is a full-stack utility application intended to support the development and organization of game projects from one centralized interface.

The application is designed around two broad needs:

1. **Project and production management** — users, projects, teams, tasks, bugs, roadmap targets, settings, and general project organization.
2. **Game content management** — assets, source-code structure, game-data definitions, registries, synchronization, validation, and eventually higher-level consistency/balance analysis.

A user may belong to or work on multiple projects. The application therefore begins at a personal/home level where projects can be created, selected, and managed before entering project-specific tooling.

The long-term goal is not to replace the game engine. It is to provide a better environment for data-heavy and organization-heavy work that is cumbersome to maintain directly in engine editors, hard-coded values, spreadsheets, or disconnected external tools.

> [!NOTE]
> The product roadmap describes intended functionality. Some systems described below are planned and are not necessarily implemented yet. See [Roadmap](Roadmap.md) for the current target sequence.

## Product structure

### User home and projects

The application operates above the individual game project so one user can work with multiple projects.

Planned responsibilities include:

- personal account and application settings;
- a user home menu;
- project creation;
- project selection;
- project settings and general management;
- project members and team management.

### Project management

Each project is intended to provide its own production-management tools, including:

- to-do/task management;
- bug tracking with detailed information, references, and images/attachments;
- roadmap targets and milestones;
- project-level settings and organization;
- team/member management.

The roadmap is intended to structure goals and targets rather than act only as a static list.

### Asset management

The asset manager is intended to maintain a registry of assets used by the game and, importantly, their provenance and release status.

This includes tracking information such as:

- what an asset is and where it is used;
- where the asset came from;
- whether it is temporary or a placeholder;
- whether it was AI-generated;
- whether the project currently has the commercial rights required to ship it;
- whether it must be replaced before release.

The purpose is to prevent temporary, unlicensed, or otherwise unsuitable production assets from being forgotten and accidentally surviving into a commercial release.

### Code and data management

The code/data side of Game Tool is intended to solve a common game-development problem: large amounts of structured gameplay data are awkward to maintain directly in source code, engine inspectors, or generic spreadsheets.

The planned **Code Manager** parses the game project's source and builds a navigable representation of relevant code structures, including concepts such as:

- classes and structures;
- inheritance;
- includes/dependencies;
- available properties and data types;
- relationships between relevant game concepts.

This parsed model can then drive the **Data Registry**. Instead of manually reproducing the structure of game objects in a spreadsheet, registry entries are created against structures understood from the game's code.

For example, a concrete game entry can expose the fields required by its parsed type, reference other registry entries, and represent structured gameplay values such as loot definitions, ranges, resources, or related objects.

The goal is to make large game-data sets easier to understand, edit, validate, and keep coherent with the actual game code.

## Planned code/data workflow

Because Game Tool runs as a web application, the browser is not expected to work directly against a developer's local game-project filesystem.

The intended synchronization model is Git-based:

```text
Game Git repository
        |
        v
Backend checkout / pull
        |
        v
Code + existing-data parsing
        |
        v
Game Tool structural model + registry
        |
        v
Editing / validation / conflict resolution
        |
        v
Generated game data
        |
        v
Commit / push
```

This gives the backend a controlled working copy from which it can parse code and current game data, while also providing a route for generated data to return to the game repository.

A core requirement of this system is **structural conflict detection**. When the game code evolves, existing registry data must not silently become invalid. The tool should eventually surface conflicts such as removed fields, changed types, removed classes, changed inheritance, invalid references, or other incompatibilities between stored data and the latest parsed structures.

A later goal is higher-level **game-design validation**: programmable rules and smarter analysis able to identify suspicious, inconsistent, or potentially unbalanced data. This is a long-term capability, not a currently defined implementation architecture.

## Roadmap

The development plan is maintained in [Roadmap.md](Roadmap.md).

The roadmap is intentionally a **living document**. Targets can be reordered, expanded, split, removed, or added as the project evolves. It describes product direction rather than an immutable specification.

## Start here

This repository is developed with a deliberately structured environment. Some files belong to the application itself, while others are part of the **RGT shared project system** used across multiple repositories.

This documentation is written for both **human contributors** and **coding agents**. Its purpose is not only to explain what exists, but also to make the rules of the repository explicit so that changes remain compatible with the rest of the project and with the shared RGT infrastructure.

> [!IMPORTANT]
> Before changing infrastructure, shared types, constants, Docker configuration, or frontend styling conventions, read the corresponding document in [`.info/`](.info/).

| Document | Purpose |
| --- | --- |
| [Roadmap](Roadmap.md) | Living product roadmap and major implementation targets. |
| [Shared system](.info/System.md) | Explains RGT, `.system`, project synchronization, and frontend-to-backend shared contracts. |
| [Development environment](.info/DevelopmentEnvironment.md) | Explains the Makefile, Docker development environment, services, ports, and development-only infrastructure. |
| [Code quality](.info/CodeQuality.md) | Defines the required formatting, linting, and build checks for frontend and backend work. |
| [Frontend](.info/Frontend.md) | Defines the frontend stack, `rgt/` versus `src/` ownership, folder organization, API/component/page/type/style rules, and the custom theme architecture. |
| [Backend](.info/Backend.md) | Defines the backend `rgt/`/`src/` structure, middleware placement, module organization, controller/router/schema responsibilities, and backend type rules. |
| [Code conventions](.info/Conventions.md) | Defines naming, exports, component structure, state updates, callbacks, constants, typing, comparisons, comments, memoization, wrappers, validation, logging, API delegation, and route conventions. |

## Core repository rules

These rules should be understood before making changes:

1. **Do not manually maintain backend copies of shared frontend contracts.** Shared API types, data types, and constants flow from the frontend to the backend through `.system/share.sh`. Backend copies may be deleted and replaced.
2. **Do not treat RGT infrastructure as ordinary project-specific code.** RGT exists to keep shared infrastructure synchronized between multiple projects.
3. **The current Docker setup is development-only by design.** The `.dev` files are not incomplete production files. Production infrastructure will be introduced separately when needed.
4. **Do not redesign the development containers into production-style images.** The current source folders are intentionally mounted into Node containers so normal source changes do not require rebuilding the environment.
5. **Validate modified TypeScript applications with formatting, linting, and a full build.** A successful lint alone is not enough.
6. **Existing project conventions take precedence over generic framework habits.** Treat the documentation as the intended direction when older or unfinished code differs from it, but do not proactively refactor unrelated code solely to make it conform. When an area is already being changed or refactored, follow the documented convention.
7. **Preserve the `src -> rgt` dependency direction.** Code inside `rgt/` must not import arbitrary application-specific `src/` code; only documented/guaranteed integration points or deliberate exceptional dependencies are allowed.
8. **Prefer RGT for genuinely reusable code.** New code that is reusable across projects belongs in `rgt/`; project-specific code belongs in `src/`. Code may move from `src/` to `rgt/` when it becomes genuinely reusable.
9. **Frontend API calls belong in the API layer.** Components and pages should call domain API handlers rather than performing direct Axios/HTTP work.
10. **Backend middleware and functionality follow dedicated folders.** Middleware belongs in `middleware/`; backend feature/domain logic belongs in `modules/`, using the established module structure when applicable.
11. **The custom frontend theme is authoritative.** `src/style/theme.ts` defines the project visual system; the MUI theme is an integration layer, not a competing source of truth.
12. **Follow the documented code conventions.** Semantic prefixes, direct parameter destructuring, relative imports, event naming, the `any` prohibition, and the project equality convention are intentional and should not be normalized to unrelated ecosystem defaults.
13. **Use project UI wrappers for application UI.** Structural/layout primitives are direct-use exceptions; MUI icons are treated as assets, and wrapper implementations may use the raw MUI family pieces needed to build the abstraction. See [Frontend](.info/Frontend.md) for the narrow exceptions.
14. **Keep backend errors centralized.** Controllers and middleware normally throw errors and let the common error middleware build the response.
15. **Treat schema serialization as part of the data contract.** Mongoose schemas define `toJSON` normalization by default so MongoDB-native values match shared application data structures.
16. **Preserve the frontend API delegation model.** Domain API functions may receive setters, callbacks, navigation, and other UI dependencies so request logic stays out of pages/contexts.
17. **Use centralized API-path constants.** Do not scatter raw backend endpoint strings through frontend or backend code.
18. **Use `ULog` for permanent backend logging.** Raw `console.*` calls in backend application code are temporary debugging, not the logging convention.
19. **Do not invent unresolved architecture.** Service/repository layers, complex-router rules, middleware ordering beyond technical requirements, and the future migration framework are intentionally undefined until a real need is designed.
20. **Keep control flow shallow.** Prefer guard clauses/early returns over deep nesting, and omit braces for single-statement `if` blocks.
21. **Do not impose import cleanup conventions that do not exist.** Relative imports are tooling-driven; there is no manual import-order/grouping rule.

## Current development topology

```text
Browser
  |
  +-- http://localhost:8081  -> Frontend / Vite
  |
  +-- http://localhost:8082  -> Backend API
  |
  +-- http://localhost:8083  -> Mongo Express

Docker development network
  |
  +-- frontend       (Node)
  +-- backend-node   (Node)
  +-- mongo          (MongoDB)
  +-- mongo-express  (MongoDB administration UI)
```

The frontend uses the actual backend during normal development. There is no separate frontend mock backend in this development setup.

## Documentation philosophy

The authoritative project documentation lives in the root documentation files (`README.md`, `Roadmap.md`) and `.info/*.md`. Markdown files elsewhere in the repository are not part of the authoritative project documentation unless they are deliberately incorporated into this structure and linked from the root README.

The root documentation explains **what the project is and where it is going**. The `.info/` documentation defines **how the repository is structured and how contributors/agents are expected to work inside it**.

Contributors and agents should use the documentation to answer questions such as:

- What is this project trying to achieve?
- What is planned versus currently implemented?
- Where should a change be made?
- Which copy of a file is authoritative?
- Which files are generated or synchronized?
- Which commands are safe to run?
- Which architectural choices are intentional?
- Which validation steps are expected before a change is considered complete?

When the documentation and an assumption based on a framework's usual conventions disagree, do not silently normalize the project. Follow the documented project convention unless a change to that convention is explicitly requested. Existing non-conforming code may be older or unfinished and does not establish a new convention by itself; unrelated cleanup is not required.
