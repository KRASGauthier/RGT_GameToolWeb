# Frontend

<!-- TOC START -->
## Table of contents

- [Technology stack](#technology-stack)
- [High-level folder model](#high-level-folder-model)
- [`public/`](#public)
- [`rgt/` versus `src/`](#rgt-versus-src)
- [`api/`](#api)
  - [Domain API functions are delegated component logic](#domain-api-functions-are-delegated-component-logic)
  - [API function naming](#api-function-naming)
  - [Endpoint constants](#endpoint-constants)
  - [Axios response wrapper](#axios-response-wrapper)
- [`components/`](#components)
  - [RGT and source components](#rgt-and-source-components)
  - [Common component props](#common-component-props)
- [MUI wrapper rule](#mui-wrapper-rule)
- [`CForm` usage](#cform-usage)
- [`context/`](#context)
  - [State ownership](#state-ownership)
- [`hooks/`](#hooks)
- [`pages/`](#pages)
  - [Page-owned nodes](#page-owned-nodes)
  - [Routing](#routing)
- [`style/`](#style)
  - [Project theme](#project-theme)
  - [Style computation](#style-computation)
  - [Style override priority](#style-override-priority)
  - [Inline `sx`](#inline-sx)
- [`types/`](#types)
  - [`types/api/`](#typesapi)
  - [`types/data/`](#typesdata)
  - [Other types](#other-types)
- [`utils/`](#utils)
- [`App.tsx` and `main.tsx`](#apptsx-and-maintsx)
- [`index.html`](#indexhtml)
- [React component structure](#react-component-structure)
- [Validation](#validation)
- [Development scripts](#development-scripts)
- [Backend integration](#backend-integration)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## Technology stack

The frontend is a **React + TypeScript** application built and served during development with **Vite**.

The current frontend ecosystem includes React, TypeScript, Vite, React Router, Axios, MUI, Emotion, ESLint, and Prettier.

Exact package versions belong to `frontend/package.json` and the lockfile. This documentation records the architecture and conventions rather than duplicating version numbers that will change.

---

## High-level folder model

The frontend is organized around three top-level areas:

```text
frontend/
├── public/
├── rgt/
└── src/
```

- `public/` contains static passthrough assets for Vite when such assets are needed.
- `rgt/` contains frontend code intended to be shared across RGT projects.
- `src/` contains code specific to this application.

The `rgt/` and `src/` trees broadly follow the same organizational vocabulary. A folder existing on only one side today does not mean that folder type is reserved to that side forever. Ownership is decided by **shared versus project-specific scope**.

For the cross-project dependency rules, see [System.md](System.md).

---

## `public/`

`public/` is Vite's passthrough static-asset directory.

It is not intended to become a generic dumping ground. Most project visuals, especially SVG icons implemented as React components, do not need to live here.

Use it only for assets that genuinely need direct static passthrough behavior.

---

## `rgt/` versus `src/`

The distinction is ownership:

```text
rgt/ = implementation intended to be shared between RGT applications
src/ = implementation owned by this application
```

When an implementation is genuinely reusable across RGT projects, `rgt/` is the preferred home. Use `src/` when the implementation is clearly specific to this application.

Do not classify code as RGT merely because its broad concept could exist elsewhere; the implementation itself must be reusable. Conversely, if project-specific code later becomes genuinely reusable, move it from `src/` into `rgt/` when appropriate rather than leaving shared infrastructure local only because of where it originated.

RGT files must not import arbitrary application-specific `src/` code. Never move project-specific code into RGT merely to work around that dependency direction. See [System.md](System.md) for the documented exceptions involving guaranteed system-provided files.

---

## `api/`

All frontend API-call logic belongs in the API layer.

Components, pages, contexts, hooks, and unrelated utilities should not perform direct Axios/HTTP work.

The normal flow is:

```text
Page / Component / Context
          ↓
Domain API function
          ↓
Shared generic API function
          ↓
Axios / HTTP
```

The shared API layer owns generic HTTP behavior such as GET/POST handling, common headers, Axios interaction, and common response/error handling.

Domain API functions sit between the UI and the shared API layer.

### Domain API functions are delegated component logic

These functions are intentionally allowed to be closely coupled to the page/context that uses them. They exist largely to keep request-heavy logic out of React files.

They may receive:

- React setters;
- context operations;
- navigation callbacks;
- notification functions;
- error setters;
- other page/context callbacks.

They may then perform the request and apply the resulting UI/state effects directly.

Example pattern:

```ts
apiUserGetFullSelf(setUserFull, push);
```

Do not refactor this system into pure data-returning repositories merely because that architecture is common elsewhere.

A return value is still appropriate when the caller genuinely needs a semantic result to continue its own logic.

### API function naming

Frontend API functions start with `api`, then identify the module/group and operation/domain action.

The final operation can be HTTP-oriented (`Get`, `Post`, etc.) or more descriptive when that better communicates intent.

### Endpoint constants

Every path used to call the backend is defined centrally in the shared API-path constants. Do not hard-code backend endpoint strings in API functions or components.

### Axios response wrapper

The backend success body is the actual shared `IAPI...` response contract requested by the endpoint. The backend does not wrap successful payloads in `IAPIData`.

`IAPIData<_T>` is a frontend-side abstraction used by the generic Axios helpers. It combines the Axios result with normalized status/error handling so domain API functions can process success and failure consistently. It is not the HTTP wire format.

Conceptually:

```text
Backend success JSON (`IAPI...`)
          ↓
Axios response
          ↓
apiGetData / apiPostData / ...
          ↓
frontend `IAPIData<IAPI...>`
```

Backend failures use the shared API error contract and are normalized into the same frontend helper result.

---

## `components/`

`components/` contains reusable UI building blocks.

Typical examples include buttons, cards/wrappers, feedback elements, text, images, inputs, navigation elements, and other small reusable UI primitives.

In this architecture, "component" is an ownership/category term, not simply "anything implemented as a React component." A larger piece of dedicated application content can technically be a React component while still belonging to the page layer rather than `components/`.

The deciding criterion is **reusability and purpose**. Dedicated page/application content stays with the page structure unless the implementation itself is genuinely reusable.

### RGT and source components

Reusable components that are genuinely cross-project belong in `rgt/components/`.

`src/components/` is valid when a component is reusable inside this application but depends on application-specific data or structures that make it unsuitable for cross-project RGT reuse.

### Common component props

Component props inherit from the common `GCompProps` base where appropriate. This keeps a single shared extension point if a property later needs to apply across the component system.

---

## MUI wrapper rule

Raw functional/visual MUI components are not used directly by normal page/application code.

Project components wrap MUI components even when the first version of the wrapper mostly forwards props. The wrapper is treated as an inheritance/control layer: it preserves the parent component capabilities while giving the project one place to add defaults, styling, behavior, or later replace the underlying implementation.

The wrapper is also responsible for hiding MUI family composition. If a MUI parent requires related raw sub-components to function (`Tabs`/`Tab`, input adornments, dialog internals, and similar family pieces), those raw pieces may be used **inside the wrapper implementation**. Final page/application code should consume the project abstraction rather than manually assembling the MUI family.

Do not use `Omit<ParentProps, "...">` as routine wrapper boilerplate. Use it only for a real TypeScript/MUI conflict or a deliberate prop override; otherwise inherit/forward the parent API normally and add separate project props when useful.

Direct-use exceptions are narrow:

- pure structural/layout primitives such as `Stack`, `Box`, or `Grid` may be used directly when wrapping them adds no useful abstraction;
- `@mui/icons-material` icons are treated as assets and may be imported/used directly;
- global MUI integration/infrastructure such as `ThemeProvider` or `CssBaseline` may be used directly where it actually configures the framework rather than representing application UI.

Do not treat these exceptions as precedent for bypassing an existing project wrapper.

---

## `CForm` usage

`CForm` is reserved for actual form workflows involving multiple fields or pieces of information, such as login/register flows or structured multi-field editors.

Do not wrap a simple standalone input in `CForm` merely because it performs validation or submits a value. A single rename field, for example, should use the appropriate input component directly and own only the validation it actually needs.

---

## `context/`

`context/` contains React contexts/providers.

Every context exposes a dedicated custom hook, and components consume the context through that hook rather than calling `useContext(...)` directly.

Prefer:

```ts
const user = useUser();
```

rather than direct context access.

The same shared-versus-project-specific ownership rule decides whether a context belongs under `rgt/` or `src/`.

### State ownership

There is no rigid threshold for when state must move to Context. Choose ownership according to actual usage and avoid excessive prop drilling.

General tendency:

- local usage -> keep state local;
- a nearby group shares it -> lift state to the appropriate common owner;
- broadly/deeply shared state that would otherwise be passed child-to-child-to-child -> Context may be appropriate.

Do not introduce Context merely for architectural purity when ordinary local/lifted state is clearer.

---

## `hooks/`

`hooks/` contains custom React hooks.

Custom hooks follow React's required `use...` naming. There is no repository-wide rule forcing hooks to be extremely narrow or broad; scope is chosen according to the concern and readability.

When called inside a component, custom hooks belong in the component's `DATA` section.

---

## `pages/`

`pages/` contains page-level React components.

Pages are generally non-reusable application screens, so most belong under `src/pages/`.

Reusable cross-project pages and page infrastructure can live under `rgt/pages/`. Authentication is a typical example of a page that may legitimately be shared between applications.

The same principle used by component props applies to shared page-prop infrastructure such as `GPageProps` where present.

### Page-owned nodes

Dedicated pieces of a page stay in the page layer even though they are technically React components. These pieces are treated as page-owned **nodes/content**, not promoted into `components/` merely because JSX was extracted into another file.

Their names cascade from the owning `P...` page so the relationship remains obvious. For a parent page named `PExample`, subordinate pieces can follow forms such as:

```text
PExample
PExampleNode
PExampleEntry
PExampleNodeInformation
```

The exact suffix reflects the role; `Node` is not the only allowed suffix. Deeper pieces continue the parent-name cascade when that improves ownership clarity.

Folder depth is decided case by case. Create page subfolders when the amount/structure of content makes them useful; do not force a folder level merely to mirror every step of the naming cascade.

### Routing

For this project, use React Router directly together with centralized route constants.

Custom navigation/routing helper abstractions are **not** the default. Introduce one only when routing is genuinely complicated enough to justify dedicated conversion/building logic, for example a large set of route parameters that must be encoded/decoded consistently.

Do not add a navigation abstraction merely to make the architecture look cleaner.

---

## `style/`

The style tree mirrors the structure/family of the components it styles.

For example, styles for input/button components belong under the corresponding style/component/input/button hierarchy rather than in arbitrary disconnected files.

A style file may serve:

- one component;
- several closely related subcomponents;
- a component family;
- shared styles at the appropriate family level.

Keep shared family styles shared rather than duplicating them in each component.

### Project theme

`src/style/theme.ts` is the authoritative project visual theme.

The project uses its own detailed theme structure rather than treating MUI's default theme model as the source of truth. This allows richer color scales and project-specific design information.

RGT styles/components may depend on this theme even though it is project-specific because the system guarantees that the theme file exists for every project.

The MUI theme is an integration layer derived around the project theme, not a competing design system.

### Style computation

Computed component style output should normally be created through `useMemo()` in the component.

### Style override priority

When a component's internal/default style is merged with caller-provided `sx`, the caller/parent specialization has priority. A page can therefore override a child component's default layout when needed.

Conceptually:

```text
Page / parent override   -> highest priority
Component-specific style
Base/shared/default      -> lowest priority
```

This follows the project's wrapper/inheritance model: components provide reusable defaults, while their callers can specialize them.

### Inline `sx`

Inline `sx` is reserved for simple layout concerns such as dimensions, spacing, positioning, alignment, and sizing.

Visual styling such as colors, borders, shadows, typography, states, and variants belongs in style files.

If a component already has a dedicated style definition, put its layout rules there too rather than splitting layout inline and appearance into the style file.

Do not create an entire style file solely for one trivial layout adjustment when no dedicated style otherwise exists.

---

## `types/`

The types system has two especially important synchronized contract areas and then ordinary local/general types.

### `types/api/`

`types/api/` contains the TypeScript structures that define frontend/backend API contracts.

These folders are synchronized from frontend to backend and the frontend copy is authoritative.

### `types/data/`

`types/data/` contains shared application data structures.

The goal is to keep frontend, backend, and database-facing data speaking the same language whenever practical instead of creating unnecessary conversion layers with different shapes at each stage.

These folders are also synchronized from frontend to backend.

### Other types

Do not create a dedicated type file merely because a type exists.

Keep a type next to the component/function that owns it when it is local and small.

Extract to `types/` when one or more of these is true:

- it is widely reused;
- it belongs to a synchronized API/data contract;
- it is a generic concept such as `TSize`;
- local type declarations are becoming large enough to make the implementation file difficult to read.

---

## `utils/`

`utils/` contains helper/utility code that does not naturally belong to a more specific frontend folder.

It is a fallback category, not a dumping ground. If logic clearly belongs to API, hooks, components, types, style, or another dedicated area, keep it there.

---

## `App.tsx` and `main.tsx`

`src/App.tsx` and `src/main.tsx` are application-specific React entry/composition files and therefore belong to `src/`.

They define this application's providers, routing, top-level composition, and application startup flow in the normal React manner.

---

## `index.html`

`frontend/index.html` belongs to the shared project infrastructure rather than being a project-specific source file.

Shared document-level setup, including common font calls, can therefore be synchronized across RGT applications.

---

## React component structure

The normal internal component order is:

```text
DATA
FUNCTIONS
EFFECT
NODES
return
```

`DATA` includes state, refs, context-hook results, custom hooks, variables, and memoized values.

For structured state updates, prefer functional setters using `prev` and never mutate current React state directly.

See [Conventions.md](Conventions.md) for the detailed code-style rules.

---

## Validation

Frontend pages/forms normally validate input for immediate UX feedback before calling the API.

This does not replace backend validation. The backend validates the same input again according to its own rules.

---

## Development scripts

The frontend currently exposes:

```text
npm run dev
npm run dev:full
npm run build
npm run lint
npm run format
npm run preview
```

The Docker development environment uses `npm run dev:full` so Vite is reachable through the container network/host port.

For validation requirements, see [CodeQuality.md](CodeQuality.md).

---

## Backend integration

The normal frontend development environment uses the real backend. It is not built around an independent mock backend.

The standard host endpoints are:

```text
Frontend: http://localhost:8081
Backend:  http://localhost:8082
```

Shared API/data contracts and constants must remain compatible with the backend synchronization rules documented in [System.md](System.md).

---

## Rules for contributors and agents

1. Put cross-project frontend implementation in `rgt/`; keep project-specific implementation in `src/`.
2. Do not create arbitrary `rgt -> src` imports.
3. Keep all direct Axios/HTTP logic inside the API layer.
4. Preserve the domain API delegation model: API functions may receive setters/callbacks/navigation and apply resulting UI effects.
5. Centralize backend-call paths in the shared endpoint constants.
6. Put reusable UI building blocks in `components/`; keep dedicated page content/nodes in the page layer and use cascading `P...` names to show ownership when useful.
7. Use project wrappers instead of raw visual/functional MUI components in page/application code; structural primitives, icons-as-assets, framework infrastructure, and raw MUI family pieces inside wrapper implementations are the narrow exceptions.
8. Consume React contexts through dedicated hooks.
9. Keep page-level screens in `pages/`, usually under `src/` unless they are genuinely cross-project pages.
10. Mirror the style hierarchy to the component/family being styled.
11. Treat `src/style/theme.ts` as the visual source of truth; do not expand the ordinary MUI theme as a competing design system.
12. Compute component styles through `useMemo()` by default.
13. Preserve caller-over-child style priority when `sx`/styles are merged.
14. Restrict inline `sx` to simple layout when no existing style definition should own it.
15. Treat frontend `types/api/` and `types/data/` as the authoritative synchronized contracts.
16. Keep small/local types with their implementation; extract only when reuse, contract ownership, generic scope, or file size justifies it.
17. Preserve the `DATA -> FUNCTIONS -> EFFECT -> NODES -> return` component structure.
18. Prefer functional `prev` setters for structured state updates.
19. Validate forms on the frontend for UX, while still expecting backend validation.
20. Validate work with format, lint, and build before considering it complete.
21. Use `CForm` only for genuine multi-field form workflows, not simple standalone inputs.
22. Choose state ownership to avoid excessive prop drilling; do not promote state to Context automatically.
23. Use React Router directly with centralized route constants unless routing complexity genuinely justifies a custom helper.
