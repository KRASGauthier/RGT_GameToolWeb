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
  - [Application shell](#application-shell)
  - [Tabs and navigation](#tabs-and-navigation)
  - [Authentication state](#authentication-state)
  - [Project state](#project-state)
  - [Notifications](#notifications)
  - [Pages and reusable components](#pages-and-reusable-components)
  - [API flow](#api-flow)
  - [Runtime API checking](#runtime-api-checking)
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

The frontend is a **React + TypeScript** application built with Vite and MUI/Emotion.

Its code is split between:

```text
frontend/rgt/
frontend/src/
```

`rgt/` contains reusable cross-application frontend infrastructure.

`src/` contains GameTool-specific pages, project flows, theme/configuration, and project-domain code.

The frontend is also the authoritative source for contracts/constants synchronized to the backend.

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

Shared constants are synchronized to the backend through `.system/share.sh`, including API paths and other values that must remain aligned between both sides.

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

Contains React contexts/providers used for shared frontend state and behavior.

Current important contexts include:

```text
CAppNotifContext
CAuthContext
CTabProvider
CProjectProvider
```

Application code should consume contexts through dedicated hooks when provided:

```ts
useNotif();
useAuth();
useTab();
useProject();
```

Keep local state local. Move state into Context only when ownership genuinely spans enough of the tree.

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

### Application shell

The current application shell is approximately:

```text
CAppNotifContext
└── App
    └── BrowserRouter
        └── ThemeProvider
            └── CAuthContext
                └── Routes
                    ├── PAuth
                    └── CProtectedRoute
                        └── PBaseTabPage
                            ├── PHome
                            ├── PProfile
                            ├── PProjectNew
                            └── PProjectNav
```

`PBaseTabPage` owns the persistent tab shell through `CTabProvider`.

The older `src/pages/shared/PBasePage.tsx` may be legacy; do not use it as the primary example for the active application shell.

### Tabs and navigation

`CTabProvider` persists open tabs through `localStorage`.

A project tab identifies the selected game project and routes into `PProjectNav`.

`PProjectNav` currently defines sections for:

```text
home
todo
bugs
roadmap
options
users
groups
```

The project area is still under active implementation.

`PProjectSettings` and `PProjectGroups` are wired current pages.

`PProjectUsers` / `PProjectUsersCards` are current work in progress and must not be treated as legacy.

`PProject` is an active project page file even though the current navigation wiring is still evolving.

### Authentication state

`CAuthContext` owns:

```text
token
user
status
login
refresh
logout
logoutEverywhere
```

The access token is kept in application memory.

The shared Axios request interceptor injects:

```text
Authorization: Bearer <token>
```

A response interceptor handles `401` responses by performing one refresh attempt and retrying the original request.

Concurrent frontend refresh requests are collapsed through a single in-flight refresh promise.

The refresh token itself is handled by the backend through an HttpOnly cookie and `withCredentials: true`.

### Project state

`CProjectProvider` owns the currently opened project for project pages.

It loads the project from the current project/tab route parameter and exposes:

```text
project
modify(...)
modifyPicture(...)
```

Current project settings allow editing:

- project name;
- game title;
- version;
- cover image.

Engine and language are chosen at project creation and are not editable in the current settings UI.

### Notifications

`CAppNotifContext` is mounted above the main application and exposes notification state through `useNotif()`.

Domain API functions can receive `push` so request failures/success information can be handled outside page bodies.

### Pages and reusable components

Reusable UI infrastructure belongs in `components/`.

Dedicated application content belongs in `pages/`.

Page-owned subcomponents can remain next to the owning page rather than being promoted into generic components.

### API flow

Normal frontend request flow:

```text
Page / Component / Context
        ↓
Domain API function
        ↓
RGT shared API helper
        ↓
Axios instance
        ↓
Backend
```

Domain API functions may intentionally receive UI handlers such as setters, notification callbacks, and error setters.

### Runtime API checking

Shared `TAPIChecker` definitions can be used by `apiCheckReponse(...)` to verify response structure at runtime.

Current checker behavior validates primitive types, nested object checkers, required/optional fields, unexpected fields, and array container type.

Per-entry validation for nested array checkers is not implemented yet and is tracked in the root `todo.md`.

### Shared contracts

The frontend is authoritative for synchronized:

```text
src/types/api
src/types/data
src/types/icons

rgt/types/api
rgt/types/data
rgt/types/components
rgt/types/TShared.ts
rgt/types/TStyles.ts

src/consts
src/consts.ts
rgt/consts.ts
```

The backend receives generated/backend-compatible copies through `make share`.

### Styling and theme

`src/style/theme.ts` is the authoritative GameTool design source.

`appTheme: IAppTheme` contains project design values such as:

- colors;
- spacing;
- radii;
- fonts;
- animations;
- gradients;
- layers.

The MUI theme exists for framework integration and is secondary to `appTheme`.

## RGT integration

### Reusable frontend code

Cross-project reusable frontend infrastructure belongs in `frontend/rgt/`.

Current examples include:

- shared API helpers;
- authentication;
- app notifications;
- persistent tab navigation;
- reusable components;
- common hooks;
- route protection;
- styles/types/utilities.

### Allowed project dependencies

RGT must not import arbitrary GameTool `src/` code.

Project-owned integration points can be consumed when the RGT baseline guarantees them.

Current important examples include:

```text
src/style/theme.ts
src/consts.ts
synchronized project contracts/constants
```

### Contract synchronization

`make share` runs `.system/share.sh`.

The frontend is authoritative.

The sharing script copies the configured contract/constant surfaces to the backend and performs backend-specific transformations.

Do not maintain the synchronized backend copies independently.

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
- [`SecurityConcerns.md`](./SecurityConcerns.md) — security follow-up items.
