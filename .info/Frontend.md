# Frontend

> Overview of the frontend architecture, ownership boundaries, and major development flows.

## Table of contents

- [Overview](#overview)
- [Structure](#structure)
  - [`rgt/`](#rgt)
  - [`src/`](#src)
  - [`public/`](#public)
  - [`index.html`](#indexhtml)
  - [`consts.ts`](#conststs)
- [Main folders](#main-folders)
  - [`api/`](#api)
  - [`components/`](#components)
  - [`context/`](#context)
  - [`hooks/`](#hooks)
  - [`pages/`](#pages)
  - [`style/`](#style)
  - [`types/`](#types)
  - [`utils/`](#utils)
- [Application architecture](#application-architecture)
  - [Pages and reusable components](#pages-and-reusable-components)
  - [Contexts and global state](#contexts-and-global-state)
  - [API flow](#api-flow)
  - [Shared contracts](#shared-contracts)
  - [Styling and theme](#styling-and-theme)
- [RGT integration](#rgt-integration)
  - [Reusable frontend code](#reusable-frontend-code)
  - [Allowed project dependencies](#allowed-project-dependencies)
  - [Contract synchronization](#contract-synchronization)
- [Development flow](#development-flow)
  - [Development container](#development-container)
  - [Development server](#development-server)
  - [Build and validation](#build-and-validation)
- [Related documentation](#related-documentation)

---

## Overview

The frontend is a React + TypeScript application built with Vite and MUI/Emotion.

Its code is split between:

- reusable cross-project infrastructure in `rgt/`;
- Game Tool-specific application code in `src/`.

The frontend is also the authoritative source for the shared frontend/backend API and data contracts that are synchronized to the backend.

---

## Structure

At a high level:

```text
frontend/
├── public/
├── rgt/
├── src/
└── index.html
```

The same functional folder types can exist under both `rgt/` and `src/`. Their location depends on ownership, not on folder type.

### `rgt/`

`rgt/` contains reusable frontend infrastructure intended to be shared across projects.

Examples include reusable:

- components;
- contexts;
- hooks;
- API infrastructure;
- styles;
- types;
- utilities.

Reusable code should generally prefer `rgt/`.

`rgt/` must not depend on arbitrary Game Tool-specific `src/` code.

### `src/`

`src/` contains Game Tool-specific frontend code.

This includes:

- application pages;
- project-specific logic;
- project-specific reusable components;
- project-specific styles;
- the project theme;
- project-specific constants and types.

Code can move from `src/` to `rgt/` later if it becomes genuinely reusable.

### `public/`

`public/` contains static assets passed through by Vite.

It should only contain assets that genuinely need to be served this way and should not become a general storage folder.

### `index.html`

`index.html` is the base HTML entry point used by Vite.

It belongs to the shared/system-level frontend foundation rather than application feature code.

### `consts.ts`

`consts.ts` contains centralized shared project constants.

The frontend copy is authoritative for constants shared with the backend.

Shared constants are synchronized to the backend through `share.sh`, including API paths and other values that must remain aligned between both sides.

Use centralized constants instead of scattering shared or API-related hard-coded values through the frontend.

---

## Main folders

These folder categories can exist under either `rgt/` or `src/`.

### `api/`

Contains frontend API-call logic.

Pages, components, and hooks should use domain API functions instead of implementing Axios requests directly.

Typical flow:

```text
UI
 ↓
Domain API function
 ↓
Shared API helper
 ↓
Axios
 ↓
Backend
```

### `components/`

Contains reusable UI components.

Cross-project reusable components belong in `rgt/components/`.

Project-specific reusable components belong in `src/components/`.

Dedicated page content should normally remain in the page structure instead of being promoted into `components/`.

### `context/`

Contains React contexts and providers used to expose shared frontend state and behavior.

Application code should normally consume them through dedicated hooks such as:

```ts
useAuth();
useUser();
```

### `hooks/`

Contains reusable custom React hooks.

Hooks that are reusable across projects belong in RGT.

Hooks that are specific to Game Tool belong in `src/`.

### `pages/`

Contains page-level and page-owned application content.

Most pages are project-specific and therefore live under `src/pages/`.

Reusable RGT pages can exist when a page genuinely belongs to shared infrastructure.

Larger page-owned pieces remain in the page layer even though they are technically React components.

### `style/`

Contains frontend styling.

The structure generally mirrors the component or component-family hierarchy.

Project-wide design values are centralized through the Game Tool theme.

### `types/`

Contains shared, generic, or heavily reused TypeScript structures.

Two folders are especially important:

```text
types/api/
types/data/
```

Both are synchronized to the backend.

Other type files are frontend-only unless explicitly synchronized.

### `utils/`

Contains reusable helpers that do not belong to a more specific frontend area.

Small helpers used by only one file should normally remain local rather than being moved into `utils/`.

---

## Application architecture

### Pages and reusable components

The frontend distinguishes between reusable UI infrastructure and application content.

Reusable UI building blocks belong in `components/`.

Dedicated application content belongs in `pages/`.

A page can contain subordinate page-owned nodes. These remain part of the page layer rather than becoming generic reusable components simply because they are implemented as React components.

### Contexts and global state

Contexts are used when state or behavior needs to be shared across a sufficiently broad or deep part of the frontend.

State that is local to a component should remain local.

State should only move upward or into Context when the actual ownership and usage justify it.

### API flow

Frontend API implementation is centralized under `api/`.

Domain API functions intentionally handle more than raw transport when useful. They may receive:

- setters;
- callbacks;
- notification functions;
- navigation functions;
- error setters.

This allows request/result handling to remain outside page/component bodies.

Generic request behavior is handled by shared API helpers.

### Shared contracts

The frontend is authoritative for shared API and data contracts.

The main synchronized areas are:

```text
src/types/api
src/types/data
rgt/types/api
rgt/types/data
```

The backend receives transformed copies through `share.sh`.

Frontend and backend should not independently redefine the same shared payload when a shared contract already exists.

### Styling and theme

`src/style/theme.ts` is the authoritative Game Tool design source.

`appTheme: IAppTheme` contains the main project design values, including concepts such as:

- colors;
- spacing;
- radii;
- fonts;
- animation;
- layers.

The MUI theme is derived for framework integration and is secondary to `appTheme`.

---

## RGT integration

### Reusable frontend code

RGT is the preferred destination for frontend code that is genuinely reusable across projects.

If code starts in `src/` and later becomes reusable, it can be moved into `rgt/`.

The move must not create arbitrary dependencies from RGT back into Game Tool-specific code.

### Allowed project dependencies

Some project files are guaranteed by project bootstrap/defaults and can intentionally be consumed by RGT.

Important examples include:

- `src/style/theme.ts`;
- project constants;
- synchronized constants and contracts.

These are deliberate integration points, not permission for RGT to import arbitrary `src/` modules.

### Contract synchronization

`share.sh` is responsible for synchronizing shared frontend/backend contracts.

The frontend side is authoritative.

The synchronization performs backend-specific transformations where required, including:

- removing frontend-only/React-specific type dependencies;
- adapting import paths for backend `.js` resolution.

Backend synchronized copies should not be edited as the source of truth.

---

## Development flow

### Development container

The frontend runs in the development Docker environment.

The host source is bind-mounted into:

```text
/home/app
```

The development image provides the Node/npm runtime rather than baking the project source into the image.

### Development server

The normal frontend development startup uses:

```bash
npm run dev:full
```

The stable development host port is:

```text
8081
```

The frontend communicates with the real backend during normal development.

### Build and validation

Before frontend work is considered complete, run:

```bash
npm run format
npm run lint
npm run build
```

The frontend build is:

```bash
tsc -b && vite build
```

Use the project Makefile as the normal project command interface when an equivalent command exists.

---

## Related documentation

- [`FrontendConventions.md`](./FrontendConventions.md) — frontend-specific coding conventions.
- [`SharedConventions.md`](./SharedConventions.md) — conventions shared by frontend and backend.
- [`RGT.md`](./RGT.md) — RGT ownership and synchronization.
- [`GettingStarted.md`](./GettingStarted.md) — development environment and commands.
