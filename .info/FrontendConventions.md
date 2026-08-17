# Frontend Conventions

> Frontend-specific coding conventions for Game Tool.  
> Generic TypeScript and cross-project rules belong in `SharedConventions.md`.

## Table of contents

- [Components](#components)
  - [Naming](#naming)
  - [Component declaration](#component-declaration)
  - [Props](#props)
  - [Reusable components](#reusable-components)
  - [Page nodes](#page-nodes)
- [Styling](#styling)
  - [`appTheme`](#apptheme)
  - [Style files](#style-files)
  - [Inline `sx`](#inline-sx)
  - [Style override priority](#style-override-priority)
  - [Computed styles](#computed-styles)
- [React](#react)
  - [Component internal order](#component-internal-order)
  - [State](#state)
  - [Context](#context)
  - [Hooks](#hooks)
  - [Effects](#effects)
  - [Memoization](#memoization)
  - [List keys](#list-keys)
- [MUI](#mui)
  - [Wrapper rule](#wrapper-rule)
  - [Allowed direct MUI usage](#allowed-direct-mui-usage)
  - [Wrapper props](#wrapper-props)
- [API](#api)
  - [API function responsibility](#api-function-responsibility)
  - [API naming](#api-naming)
  - [UI handling inside API functions](#ui-handling-inside-api-functions)
  - [Shared API contracts](#shared-api-contracts)
- [Forms and validation](#forms-and-validation)
  - [`CForm`](#cform)
  - [Frontend validation](#frontend-validation)

---

## Components

### Naming

Reusable React components use the `C...` prefix.

Pages and page-owned React content use the `P...` prefix.

Examples:

```text
CButton
CTextField
CCard

PHome
PSettings
PProject
```

Component prop interfaces use the component name directly:

```ts
CButtonProps
PHomeProps
CButtonStyleProps
```

Do not add the general `I...` interface prefix to component props:

```ts
// Avoid
ICButtonProps
```

The dedicated component filename and main export should match when practical.

### Component declaration

React components use function declarations:

```tsx
function CExample({ value }: CExampleProps) {
	return <div>{value}</div>;
}
```

Do not use an arrow-function constant as the normal component declaration style:

```tsx
// Avoid as the default style
const CExample = () => {
	...
};
```

Props should normally be destructured directly in the function signature.

### Props

Reusable components should inherit the common component prop base when appropriate:

```ts
interface CExampleProps extends GCompProps {
	...
}
```

Page props may use `GPageProps` where appropriate.

The common prop layer exists so global capabilities can be introduced centrally later without redefining them across every component.

When wrapping another component or MUI type, preserve the parent API where practical.

Do not use `Omit<ParentProps, "...">` as normal boilerplate.

Use `Omit` only when:

- a real TypeScript/MUI conflict exists;
- a parent prop is deliberately being replaced or reinterpreted.

### Reusable components

`components/` is for reusable UI building blocks.

Examples include:

- buttons;
- inputs;
- cards;
- text/display primitives;
- reusable navigation elements;
- surfaces;
- feedback components.

If a component is reusable across projects, prefer `rgt/components/`.

If it is reusable inside Game Tool but depends on Game Tool-specific structures, use `src/components/`.

Do not move dedicated page content into `components/` merely because React technically treats it as a component.

### Page nodes

Large or dedicated pieces of one page remain in the page structure.

Their names cascade from the owning page so their relationship is immediately visible.

For a parent such as:

```text
PTodo
```

related page-owned pieces can follow forms such as:

```text
PTodoNode
PTodoEntry
PTodoNodeInformation
```

The suffix should describe the role. `Node` is not mandatory.

Deeper page-owned content can continue the naming cascade when useful.

Folder depth is decided case by case. Add subfolders when they genuinely improve readability; do not create them mechanically.

---

## Styling

### `appTheme`

`src/style/theme.ts` is the authoritative project design source.

`appTheme: IAppTheme` is the primary source for design values such as:

- colors;
- spacing;
- radii;
- fonts;
- animation;
- layers;
- other project design tokens.

The MUI theme is secondary and exists mainly for MUI/framework integration.

Do not make the standard MUI theme the main design system.

### Style files

Style files generally mirror the component or component-family hierarchy.

A style file may belong to:

- one component;
- a related component family;
- a shared style group.

If a component already has a dedicated style file/object, keep that component's layout there too instead of splitting its styling between inline `sx` and the style file.

Do not create a dedicated style file for one trivial layout rule when the component otherwise does not need one.

### Inline `sx`

Inline `sx` is acceptable for simple layout concerns such as:

- dimensions;
- spacing;
- positioning;
- alignment;
- sizing;
- layout behavior.

Visual styling belongs in style files, including:

- colors;
- borders;
- shadows;
- typography treatments;
- visual variants;
- hover/focus states.

### Style override priority

Style specialization follows this priority:

```text
Caller / page override
        ↓
Component-specific style
        ↓
Base / shared default
```

Caller/page styles have the highest priority.

Reusable components should therefore remain customizable by their consumers.

### Computed styles

Computed style objects should normally use `useMemo()`.

Example:

```ts
const style = useMemo(() => {
	return CExampleStyle({ active });
}, [active]);
```

This is preferred when the style object depends on component state or props.

---

## React

### Component internal order

The preferred internal order of a React component is:

```text
DATA
FUNCTIONS
EFFECT
NODES
return
```

#### DATA

Contains dependencies and values such as:

- hooks;
- contexts;
- state;
- refs;
- variables;
- memoized values;
- data dependencies.

Custom hooks belong here.

#### FUNCTIONS

Contains local logic and event callbacks.

#### EFFECT

Contains React effects.

#### NODES

Contains prepared JSX fragments when extraction improves readability.

Simple JSX should stay directly in the final return.

### State

Keep state close to where it is used.

General tendency:

```text
local usage
→ local state

nearby shared usage
→ lift state where appropriate

broad/deep shared usage
→ Context when prop drilling becomes excessive
```

For a simple replacement, a direct setter is fine.

For structured updates that preserve previous state, prefer:

```ts
setValue(prev => ({
	...prev,
	name: newName,
}));
```

Never mutate React state directly.

### Context

Contexts should expose dedicated hooks such as:

```ts
useAuth();
useUser();
```

When a dedicated hook exists, application components should use it instead of calling `useContext()` directly.

Context should be introduced when the actual ownership and sharing needs justify it, not for architectural purity.

### Hooks

Custom hooks use the normal `use...` naming.

Inside components, hooks belong in the `DATA` section.

Do not create custom routing/navigation hooks or other abstractions merely because they could exist. Add abstractions when the actual complexity justifies them.

### Effects

There is no blanket cleanup rule for `useEffect`.

Add cleanup when the effect genuinely creates something that must be removed or cancelled, such as:

- Axios interceptors;
- subscriptions;
- listeners;
- timers;
- persistent external effects.

Do not mechanically add empty or unnecessary cleanup functions.

### Memoization

`memo()` is not a default optimization.

Use whole-component `memo()` only when there is a real reason.

`useCallback()` is also not the default for normal local functions.

Use it when:

- React dependency behavior requires it;
- a stable function reference is actually important.

`useMemo()` is commonly appropriate for computed style objects and other meaningful computed values.

### List keys

Use the strongest real unique identifier available.

Priority:

1. `uid`;
2. another field guaranteed to be unique;
3. a generated/local identifier when useful;
4. array index as fallback.

Do not use a field as a key merely because it looks unique.

---

## MUI

### Wrapper rule

Normal application code must not use raw functional or visual MUI components when a project wrapper exists or should exist.

Project wrappers are used so behavior and styling can be centralized later without rewriting page code.

Typical pattern:

```text
MUI component
      ↓
Project C... wrapper
      ↓
Application/page code
```

The wrapper exists to:

- centralize defaults;
- centralize styling behavior;
- expose project-specific props;
- hide MUI composition details;
- preserve a stable project-facing API.

### Allowed direct MUI usage

Direct MUI usage is intentionally limited.

Allowed cases include:

- layout/structural primitives such as `Stack`, `Box`, and `Grid`;
- `@mui/icons-material` icons, which are treated primarily as assets;
- framework-level infrastructure such as `ThemeProvider` and `CssBaseline`;
- raw MUI sub-components used internally by a wrapper to build that wrapper.

A page should not manually assemble MUI parent/sub-components when the project wrapper is meant to encapsulate that composition.

### Wrapper props

Wrapper APIs should preserve the useful parent MUI API where practical.

Project-specific concepts can use dedicated props such as:

```ts
styling
```

instead of unnecessarily replacing native MUI concepts such as `variant`.

Do not remove inherited parent props without a real reason.

---

## API

### API function responsibility

Frontend HTTP implementation belongs in `api/`.

Pages, components, and hooks should not directly contain Axios/request implementation.

Normal flow:

```text
UI / Context
      ↓
Domain API function
      ↓
Shared API helper
      ↓
Axios
      ↓
Backend
```

### API naming

Frontend API functions begin with:

```text
api...
```

Examples follow the domain and operation being performed.

Backend endpoint paths must come from centralized shared constants.

Do not scatter hard-coded API paths through frontend code.

### UI handling inside API functions

Frontend domain API functions are intentionally allowed to behave like externalized component logic.

They may receive:

- setters;
- callbacks;
- notification functions;
- navigation functions;
- form/server error setters;
- other UI-side handlers.

For example:

```ts
apiUserGetFullSelf(setUserFull, push);
```

They may perform the request and apply the resulting state/UI behavior directly.

Do not automatically refactor these functions into pure repository-style functions that only return Axios data.

Return values are appropriate when the caller genuinely needs a semantic result, such as a boolean availability check.

### Shared API contracts

`types/api/` contains the authoritative frontend/backend API contracts.

The frontend copy is the source of truth.

Frontend and backend should not independently redefine the same request/response payload when a shared contract already exists.

`IAPIData<_T>` is frontend API-helper infrastructure around Axios handling.

It is not the backend HTTP response format.

---

## Forms and validation

### `CForm`

`CForm` is only for real form workflows containing multiple related fields or pieces of information.

Examples:

- login;
- registration;
- structured multi-field editors.

Do not use `CForm` around a simple standalone input such as a single rename field.

Standalone inputs should use their appropriate input component directly.

### Frontend validation

Frontend validation exists for user experience and immediate feedback.

It does not replace backend validation.

The backend must validate the same input again before trusting or storing it.
