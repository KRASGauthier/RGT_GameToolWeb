# Code Conventions

<!-- TOC START -->
## Table of contents

- [Scope](#scope)
- [Naming prefixes](#naming-prefixes)
  - [Props naming exception](#props-naming-exception)
  - [Mongoose model naming](#mongoose-model-naming)
- [Filenames and primary exports](#filenames-and-primary-exports)
- [Default exports and named exports](#default-exports-and-named-exports)
- [Function declaration style](#function-declaration-style)
  - [React component declaration](#react-component-declaration)
- [Function return types](#function-return-types)
- [Function parameter destructuring](#function-parameter-destructuring)
- [Async style](#async-style)
- [Interfaces and type aliases](#interfaces-and-type-aliases)
- [Generic parameter naming](#generic-parameter-naming)
- [Centralized value sets versus unions](#centralized-value-sets-versus-unions)
- [Import handling](#import-handling)
- [Control flow](#control-flow)
- [Section splitters](#section-splitters)
  - [Major section](#major-section)
  - [Normal subsection](#normal-subsection)
  - [Small subsection](#small-subsection)
  - [Minimal local marker](#minimal-local-marker)
- [React component internal order](#react-component-internal-order)
  - [Data](#data)
  - [Functions](#functions)
  - [Effect](#effect)
  - [Nodes](#nodes)
- [React state updates](#react-state-updates)
- [`null` and `undefined`](#null-and-undefined)
- [Optional chaining and non-null assertions](#optional-chaining-and-non-null-assertions)
- [React list keys](#react-list-keys)
- [Event callback naming](#event-callback-naming)
- [Constants and inline literals](#constants-and-inline-literals)
- [TypeScript `any`](#typescript-any)
- [Equality operators](#equality-operators)
- [Comments](#comments)
  - [`TODO` comments](#todo-comments)
- [Memoization](#memoization)
  - [Styling](#styling)
  - [Component-level `memo()`](#component-level-memo)
  - [`useCallback()`](#usecallback)
  - [Effect cleanup](#effect-cleanup)
- [React context access](#react-context-access)
- [MUI wrapper model](#mui-wrapper-model)
- [Style override priority](#style-override-priority)
- [Inline `sx`](#inline-sx)
- [Fallback expressions](#fallback-expressions)
- [Type assertions](#type-assertions)
- [Validation](#validation)
- [Environment variables](#environment-variables)
- [Logging](#logging)
- [Frontend API function naming](#frontend-api-function-naming)
- [API contract naming](#api-contract-naming)
- [Frontend API delegation model](#frontend-api-delegation-model)
- [API and route constants](#api-and-route-constants)
- [Helper placement](#helper-placement)
- [Intentionally flexible or unresolved areas](#intentionally-flexible-or-unresolved-areas)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## Scope

This document records the coding conventions that apply across the repository unless a more specific frontend, backend, or system document says otherwise.

These rules describe this codebase as it is intended to be maintained. They are not invitations to normalize the project toward generic React, TypeScript, Express, Mongoose, or JavaScript conventions.

Treat the documented conventions as the project's general working rules. They should be respected by default, while still allowing context, technical constraints, or a deliberate architectural decision to justify an exception. The documentation is not divided into separate "mandatory" and "preference" classes.

When existing code is inconsistent with a documented convention, treat the documentation as the intended direction unless the task explicitly changes it. Do not proactively refactor unrelated code solely to make it conform; when code in that area is already being changed or refactored, apply the documented convention.

---

## Naming prefixes

Naming prefixes are a **core project convention**. Important symbols should identify their role from their name.

| Prefix | Meaning | Example |
| --- | --- | --- |
| `C...` | React component | `CButton` |
| `P...` | Page | `PAuth` |
| `U...` | Utility-oriented structure/file | `UStyles` |
| `T...` | Type/type-oriented structure | `TSize` |
| `I...` | Interface or structured data interface | `IUserFull` |
| `G...` | Global/base interface intended for inheritance | `GCompProps` |
| `E...` | Enum or enum-like structure | `EAppMenus` |
| `S...` | Mongoose schema | `SUser` |
| `M...` | Mongoose model | `MUser` |
| `api...` | Frontend domain API function | `apiUserGetFullSelf` |

### Props naming exception

Props interfaces do not use the `I...` prefix. They are named from the component/page they belong to:

```ts
interface CButtonProps {
    // ...
}

interface PHomeProps {
    // ...
}
```

Style props follow the same rule:

```ts
interface CButtonStyleProps {
    // ...
}
```

Do not rename them to `ICButtonProps`, `IPHomeProps`, or similar forms.

### Mongoose model naming

A Mongoose model uses the `M...` prefix so backend code immediately distinguishes a model from ordinary application data.

Prefer:

```ts
const MUser = model(...);
```

not:

```ts
const User = model(...);
```

The `M` prefix means **model**, not module.

---

## Filenames and primary exports

A filename should correspond to its main concept/export when that relationship is meaningful.

For React components and pages, matching is the established rule:

```text
CButton.tsx -> CButton
PAuth.tsx   -> PAuth
```

For other files, matching is strongly preferred when the file is centered around one major concept, but it is not a universal one-file/one-symbol rule.

A utility file such as `UStyles.ts` may contain several named utility functions. A style file may be named for the component or style family it serves while exporting several style functions.

---

## Default exports and named exports

Use a default export when a file is genuinely dedicated to one primary element.

This most commonly applies to:

- React components;
- pages;
- contexts/providers when the file is clearly dedicated to one primary React structure.

Example:

```ts
function CButton(...) {
    // ...
}

export default CButton;
```

Files that naturally expose several meaningful symbols should normally use named exports. This includes most:

- utilities;
- API handlers;
- backend controllers;
- type collections;
- style files.

The decision is based on **file dedication**, not on a blanket preference for one export syntax.

---

## Function declaration style

Both function forms are accepted:

```ts
function doSomething() {
    // ...
}
```

and:

```ts
const doSomething = () => {
    // ...
};
```

The general tendency is:

- use `function` for important, standalone, or clearly defined functions;
- use arrow-function constants for local callbacks or logic that naturally behaves like a declared variable;
- use whichever form is technically appropriate when scope or behavior makes the distinction matter.

### React component declaration

React components are an explicit exception: components are declared with `function`, not arrow-function constants.

Preferred:

```tsx
function CButton({ ... }: CButtonProps) {
    // ...
}
```

Avoid:

```tsx
const CButton = ({ ... }: CButtonProps) => {
    // ...
};
```

---

## Function return types

Named functions should explicitly declare their non-`void` return type.

```ts
function getUser(): IUser {
    // ...
}
```

A `void` return type may be omitted. Inline callbacks may rely on inference when the inferred type is clear and useful.

The purpose is to make standalone function contracts explicit without adding noise to every callback.

---

## Function parameter destructuring

Object parameters should be destructured directly in the function signature whenever their individual fields are used.

For React components this is the established normal form:

```ts
function CButton({
    label,
    disabled,
    onClick,
}: CButtonProps) {
    // ...
}
```

Avoid:

```ts
function CButton(props: CButtonProps) {
    const { label, disabled, onClick } = props;
    // ...
}
```

A rare exception is acceptable when keeping the original object intact materially simplifies forwarding/spreading a large group of values, especially styling-related values. Even then, direct signature destructuring remains the preference when practical.

---

## Async style

Prefer `async` / `await` for asynchronous code across the project.

Avoid ordinary `.then()` / `.catch()` chains when the same flow can be expressed directly with `await`. Promise chains may still appear at an async execution boundary when there is a concrete technical or readability reason.

Do not mechanically rewrite a boundary chain that exists for a valid reason, but do not introduce promise-chain style as the normal project pattern.

---

## Interfaces and type aliases

Prefer `interface` for ordinary object/data structures. Interfaces match the project's class-like mental model for structured data and remain naturally extendable.

Use `type` when the construct is naturally a type expression, including:

- unions;
- aliases;
- discriminated unions;
- mapped/composed type expressions;
- other combinations where an interface is not the natural representation.

Default structured object/data shape: **use an interface**.

---

## Generic parameter naming

Generic/template parameter names always begin with `_`.

Use `_T` for a simple single generic and descriptive underscore-prefixed names when several generics are involved:

```ts
function cloneValue<_T>(value: _T): _T {
    // ...
}

interface IMapper<_TInput, _TOutput> {
    // ...
}
```

---

## Centralized value sets versus unions

Use an `E...` centralized enum-like value structure when a value set is reused or authoritative and may evolve over time. This gives usages a shared source of truth and useful IntelliSense.

A simple local/stable type-only value set can remain a union when centralization would add no practical value.

Do not convert every union into an `E...` structure mechanically.

---

## Import handling

Imports are primarily left to the editor/tooling rather than manually curated.

Use normal relative imports generated by the editor/tooling:

```ts
import CText from "../../../rgt/components/text/CText";
```

Do not introduce path aliases such as `@/` or `@rgt/` unless the project architecture is explicitly changed to adopt them.

When an import is used only as a TypeScript type, keep the `import type` form when the tooling/TypeScript requires or generates it. There is no separate project rule requiring contributors to manually rewrite imports solely to change their syntax.

There is **no import-order convention**. Do not spend time manually sorting or grouping imports into libraries/RGT/source/types/styles. Remove unused imports when TypeScript or ESLint flags them, but otherwise leave normal automatic import placement alone.

---

## Control flow

Prefer shallow control flow over deep nesting.

When a general or invalid case can be rejected immediately, use an early return/guard clause so the main execution path remains flat:

```ts
if (!user)
    return;

doSomething();
```

Avoid unnecessary chains of nested `if` blocks that create indentation inside indentation when the same logic can be expressed clearly with an early exit.

Conditions that naturally belong together can of course be combined rather than creating several artificial guard clauses.

For a single-statement `if`, omit braces:

```ts
if (!user)
    return;
```

Use braces when the conditional body contains multiple statements.

---

## Section splitters

Section comments are an intentional readability convention. Choose the visual weight according to the amount and importance of code being separated.

### Major section

```ts
//--------------------------------------------------
//                                    NAME
//--------------------------------------------------
```

### Normal subsection

```ts
//====================== NAME ======================
```

### Small subsection

```ts
//--------------------- NAME ---------------------
```

### Minimal local marker

```ts
//DATA
```

The splitters exist to make files easier to scan. Do not use a large separator where a smaller marker is enough.

---

## React component internal order

The normal internal component order is:

```text
DATA
FUNCTIONS
EFFECT
NODES
return
```

This order follows dependency flow rather than being purely cosmetic.

### Data

`DATA` is the declaration area at the top of the component. It includes, when applicable:

- state;
- refs;
- context-derived values;
- custom hooks;
- variables;
- memoized values;
- other data dependencies.

### Functions

`FUNCTIONS` contains local logic and callbacks that operate on the declared data.

### Effect

`EFFECT` contains effects, which commonly depend on both the data and functions declared above them.

### Nodes

`NODES` contains prepared JSX nodes/render fragments used by the final return. Use it mainly for conditional JSX or when JSX/data becomes large enough that extraction materially improves readability. Keep simple JSX directly in the final `return`; do not extract every small block into `NODES`.

---

## React state updates

For simple state replacement, use the setter directly:

```ts
setOpen(true);
setStatus("authed");
```

When updating part of an object or array while preserving previous state, prefer the functional setter form:

```ts
setValue((prev) => ({
    ...prev,
    field: newValue,
}));
```

```ts
setItems((prev) => [...prev, newItem]);
```

`structuredClone()` remains acceptable when the structure or operation genuinely makes it useful, but it is not the default for ordinary state updates.

Do not mutate the current React state object or array directly.

---

## `null` and `undefined`

The project treats these as different concepts:

- `undefined` means **not set / absent / not provided**;
- `null` is an **explicit value** representing a meaningful "no value" state.

Examples:

```ts
let node: ReactNode | undefined;
```

`undefined` means there is simply no node to render.

```ts
let user: IUser | null;
```

`null` can mean that the application explicitly knows there is no user.

Use `null` deliberately. Do not use it interchangeably with `undefined` when the distinction matters.

---

## Optional chaining and non-null assertions

There is no blanket ban on optional chaining or non-null assertions, but missing-data control flow should stay explicit.

When `null`/`undefined` is genuinely possible and the function should stop if the value is missing, prefer a guard clause:

```ts
if (!user)
    return;

useUser(user);
```

This is generally preferred over continuing a function through `user?.something` when absence means the operation should not continue.

Optional chaining remains valid when it accurately expresses optional behavior. A non-null assertion (`value!`) is acceptable when the value is genuinely known to exist; do not use it merely to silence TypeScript.

---

## React list keys

Choose React list keys in this priority order:

1. `uid` when available;
2. another field/value guaranteed unique in that list, such as a unique name or value;
3. a generated/local identifier when useful, for example a `useId()` base combined with an index;
4. the array index only as a fallback.

Do not use a field as a key merely because it is convenient; it must actually be unique in the rendered list.

---

## Event callback naming

Functions used as event callbacks use the `on...` prefix.

This applies both to callbacks exposed through props and to local handlers connected to an event/signal.

```ts
interface CButtonProps {
    onClick: () => void;
}

function CExample() {
    const onClick = () => {
        // ...
    };

    return <CButton onClick={onClick} />;
}
```

Do not systematically rename local event handlers to `handleClick`, `handleChange`, etc. The project convention is `onClick`, `onChange`, `onSubmit`, and similar names.

---

## Constants and inline literals

Meaningful fixed values should generally become named constants rather than being repeated as magic values.

Prefer:

```ts
const MAX_RETRIES = 10;
const CLOSE_DELAY = 300;
```

for values that represent configuration, limits, delays, identifiers, or another meaningful fixed concept.

Existing code may still contain inline literals where the shortcut was taken during development. That does not redefine the intended convention.

---

## TypeScript `any`

Explicit `any` is forbidden.

The project keeps ESLint's `no-explicit-any` protection. Contributors must not disable or bypass the rule merely to make typing easier.

Use an appropriate explicit solution instead:

- a real interface/type;
- a generic;
- `unknown` with narrowing;
- a library-provided type.

---

## Equality operators

The project deliberately prefers loose equality:

```ts
value == expected
value != expected
```

Do not systematically replace it with strict equality.

Strict equality is allowed when coercion could create ambiguity, incorrect behavior, or a concrete bug risk:

```ts
value === expected
value !== expected
```

The rule is therefore:

> Use `==` / `!=` by default. Use `===` / `!==` when there is a technical reason for type-sensitive comparison.

---

## Comments

There is no required comment density.

Comments are welcome when they add useful context, reasoning, warnings, or explain behavior that is not obvious from the code itself.

Useful:

```ts
// Retry only after the refreshed token has been stored.
```

Unhelpful:

```ts
// Set the user
setUser(user);
```

Do not narrate obvious code merely to increase the amount of commenting.

### `TODO` comments

Use `TODO` comments for intentionally unfinished or temporary work that should be revisited.

```ts
// TODO: Replace temporary implementation
```

There is no mandatory separate `TEMP`/`FIXME` convention.

---

## Memoization

Memoization is targeted, not automatic.

### Styling

Computed component style output should normally be produced through `useMemo()` so style objects are not rebuilt unnecessarily on every render.

```ts
const style = useMemo(
    () => CButtonStyle({ variant, size, disabled }),
    [variant, size, disabled],
);
```

### Component-level `memo()`

`React.memo()` is not a blanket rule. It may be used when the component genuinely benefits from it, including cases where the styling arrangement could not practically be handled with the normal `useMemo()` pattern.

Do not wrap every component in `memo()` as boilerplate.

### `useCallback()`

A normal local function is the default. Do not wrap callbacks in `useCallback()` automatically.

Use `useCallback()` when React behavior actually benefits from a stable function reference, especially for dependency-sensitive effects or other cases where reference stability is technically relevant.

The project does not treat `useCallback()` as routine boilerplate or a general performance rule.

### Effect cleanup

There is no blanket rule requiring cleanup code in every `useEffect()`.

Add cleanup when the effect creates something that genuinely needs to be removed, cancelled, detached, or ejected. Interceptors, listeners, timers, subscriptions, or similar persistent resources are examples where cleanup may be important.

The authentication interceptor/eject pattern is an example of cleanup that is technically relevant.

Do not mechanically refactor every existing effect to add cleanup where no concrete lifecycle problem exists.

---

## React context access

Every React context should expose a dedicated custom hook. Components should consume the context through that hook rather than calling `useContext(...)` directly.

Prefer:

```ts
const user = useUser();
```

rather than:

```ts
const user = useContext(UserContext);
```

The hook is the public, explanatory interface to the context.

There is no fixed rule for how broad or narrow a custom hook must be; that depends on the concern being implemented.

---

## MUI wrapper model

Application code does not normally use raw functional/visual MUI components.

MUI UI components are wrapped by project components even if the wrapper initially does little more than forward props. This gives the project one control point for future styling, behavior, defaults, or underlying-library changes.

The wrapper should preserve as much of the underlying component API as practical. Conceptually, wrappers are treated as an inheritance layer: they add or reinterpret project-specific behavior and forward the remaining parent props.

The direct-use exceptions and the rules for raw MUI sub-components inside wrapper implementations are defined in [Frontend.md](Frontend.md). Do not broaden those exceptions into a general license to bypass project wrappers in page/application code.

---

## Style override priority

Style specialization flows from the caller toward the child. A page/parent-provided `sx` should be able to override the component's internal/default style when both define the same property.

Conceptually:

```text
Page / parent override   -> highest priority
Component-specific style
Base/shared/default      -> lowest priority
```

This follows the wrapper/inheritance model: lower-level components provide defaults, while callers can specialize them when necessary.

---

## Inline `sx`

Inline `sx` is reserved for simple **layout concerns**, such as:

- dimensions;
- spacing;
- positioning;
- alignment;
- sizing;
- layout behavior.

Visual styling such as colors, borders, shadows, typography treatments, states, and component variants belongs in the relevant style file.

If a component already has a dedicated style definition, keep its layout styling there as well rather than splitting layout into inline `sx` and appearance into the style file.

Do not create a dedicated style file solely for one trivial layout adjustment when no style file otherwise exists.

---

## Fallback expressions

There is no rigid repository rule prescribing `??`, `||`, ternaries, explicit checks, or default parameters in every fallback situation. Use the operator that matches the intended logic.

General tendencies are:

- use default parameters when the fallback naturally belongs to a function argument;
- `??` is commonly used when `null`/`undefined` should trigger the fallback;
- `||` is uncommon and should only be used when all falsy values are intentionally treated as missing;
- explicit conditions are acceptable when they make an ambiguous case clearer.

This is a logic choice, not a formatting convention.

---

## Type assertions

Normal TypeScript assertions are acceptable when the developer genuinely knows the runtime shape and the cast is justified:

```ts
const user = data as IUser;
```

Casting is not a substitute for thinking about runtime validity, but it is not forbidden.

Avoid double assertions such as:

```ts
const user = data as unknown as IUser;
```

as much as possible. They bypass a significant part of TypeScript's safety and should be reserved for cases where the type system is blocking a known-valid operation and no cleaner practical solution exists.

---

## Validation

Validation is intentionally performed on both sides of the application.

Frontend pages/forms validate for immediate UX feedback and to prevent obviously invalid submissions.

The backend validates again and never trusts frontend validation as authoritative.

When Mongoose can enforce a backend rule cleanly through the schema, let Mongoose enforce it. When it cannot, add explicit backend validation logic/handlers, as with password restrictions.

---

## Environment variables

There is no rigid abstraction requiring every environment variable to pass through one configuration object.

- direct `process.env...` access is acceptable for values used locally or rarely;
- frequently reused environment values may be centralized in a constants/configuration file when that improves readability;
- do not refactor existing environment access solely for architectural purity.

---

## Logging

Permanent backend logging goes through the project's `ULog` system.

Backend code should log meaningful operations sufficiently to provide a clear view of what the server is doing.

Direct `console.log`, `console.error`, and similar calls should not remain in backend application code. If they appear, they are normally temporary debugging or something that should be cleaned up. Console use inside the `ULog` implementation itself is naturally allowed.

Frontend logging is different: there is no permanent logging system by default. `console.*` is primarily acceptable for temporary debugging and should not be treated as normal application behavior.

---

## Frontend API function naming

Frontend domain API functions start with `api`, followed by the relevant module/group and the operation/domain action.

The operation may be a simple HTTP-oriented action (`Get`, `Post`, etc.) or a more descriptive action when that communicates the intent better.

The goal is that the name immediately identifies:

1. that it is a frontend API-domain function;
2. which group/module it belongs to;
3. what operation it performs.

---

## API contract naming

Shared API contract interfaces follow the pattern:

```text
IAPI + Group + Description
```

Example:

```ts
interface IAPIUserCheckAvailable {
    // ...
}
```

Keep the name short but explanatory. Do not mechanically add `Request`/`Response` suffixes when the operation name already makes the role clear. `Rcv` or separate request/response names are acceptable when a real ambiguity requires them.

---

## Frontend API delegation model

Frontend domain API functions are intentionally more than thin request wrappers. They behave like **externalized component logic** used to keep pages/contexts readable.

A page/context may pass setters, callbacks, navigation, notifications, or other UI-facing dependencies directly into the API function.

Example pattern:

```ts
apiUserGetFullSelf(setUserFull, push);
```

The domain API function may then:

- call the shared generic API layer;
- validate/interpret the response;
- handle API-specific error flow;
- extract data;
- update React state;
- trigger navigation;
- trigger notifications or other callbacks.

This coupling is intentional. Do not refactor these functions into pure repositories merely because another architecture would separate UI effects from API functions.

A return value is still appropriate when the caller genuinely needs a semantic result to continue its own local logic.

---

## API and route constants

Every path used to call the backend is centralized in the API-path constants collection. Do not scatter raw endpoint strings throughout frontend or backend code.

The shared constants give both sides one authoritative view of the backend API surface.

Frontend application routing paths are centralized in constants as well. They are frontend-specific in purpose even if the shared synchronization system causes those constants to exist on the backend too.

---

## Helper placement

Place helper logic according to its actual reuse scope:

- helper used only by one file -> keep it local to that file;
- helper shared inside one feature/module -> keep it in a module-specific helper/handler/shared file;
- helper reusable or plausibly reusable across the wider project -> place it in `utils/` / `util/` as appropriate.

Do not promote every local helper into a global utility folder.

---

## Intentionally flexible or unresolved areas

Do not manufacture hard rules where the project has not chosen one yet.

The following remain context-dependent or unresolved:

- the exact scope of custom hooks;
- whether complex backend routers will stay as thin as current routers;
- whether a service/repository layer will ever be needed;
- the architecture of future database migrations;
- whether `structuredClone()` or another immutable-update method is preferable in unusual complex state updates;
- whether environment values should be centralized when they are only used once;
- the exact amount of `useEffect()` cleanup outside cases where lifecycle cleanup is clearly required;
- middleware ordering beyond concrete Express/middleware technical requirements.

When one of these areas becomes relevant, follow the existing local pattern and the task requirements rather than inventing a repository-wide abstraction.

---

## Rules for contributors and agents

1. Use the semantic naming prefixes.
2. Use `M...` for Mongoose models and `S...` for schemas.
3. Name props `<ComponentName>Props` / `<PageName>Props`, without `I`.
4. Match component/page filenames to their component/page names.
5. Use default exports for files genuinely dedicated to one primary element; otherwise use named exports.
6. Declare React components with `function`, not arrow-function constants.
7. Give named functions an explicit non-`void` return type; inference is fine for appropriate inline callbacks.
8. Destructure object parameters directly in function signatures by default.
9. Prefer `async` / `await` over ordinary promise chains.
10. Prefer `interface` for ordinary structured object/data shapes; use `type` for unions, aliases, and other natural type expressions.
11. Prefix generic/template parameters with `_`, using `_T` or descriptive forms such as `_TInput`.
12. Keep relative imports and leave import syntax/order primarily to the tooling; do not introduce aliases or manual import-order schemes without an explicit architecture change.
13. Prefer early returns and shallow control flow; omit braces for single-statement `if` blocks.
14. Use the splitter hierarchy to keep larger files readable.
15. Preserve the `DATA -> FUNCTIONS -> EFFECT -> NODES -> return` component order, but use `NODES` only when extraction improves readability.
16. Prefer functional `prev` setters for structured React state updates and never mutate current state directly.
17. Treat `undefined` as unset/absent and `null` as an explicit no-value state.
18. Prefer an explicit guard when nullable data means execution should stop; use optional chaining/non-null assertions only when they accurately express known behavior.
19. Use genuinely unique React list keys, preferring `uid` and using array indexes only as a fallback.
20. Name event callbacks `on...`.
21. Prefer named constants for meaningful fixed values.
22. Never use explicit `any`.
23. Use centralized `E...` value sets when they are reused/authoritative; local stable alternatives may remain unions.
24. Prefer `==` / `!=`; use strict equality only when technically needed.
25. Use normal casts when justified; avoid `as unknown as ...` unless there is no cleaner practical solution.
26. Comment non-obvious intent, not obvious syntax; use `TODO` for intentionally unfinished/temporary work.
27. Memoize computed styles with `useMemo()` by default; use `useCallback()` and component-level `memo()` only when technically useful.
28. Add `useEffect()` cleanup when the created resource genuinely requires lifecycle cleanup; do not add it mechanically everywhere.
29. Consume contexts through their dedicated hooks.
30. Use project wrappers instead of raw functional/visual MUI components; see [Frontend.md](Frontend.md) for wrapper-prop inheritance details.
31. Allow caller/page styling to override child/default styling when styles are merged.
32. Restrict inline `sx` to simple layout when no dedicated style already owns the component styling.
33. Choose fallback operators according to the intended logic rather than a mechanical style rule.
34. Validate on both frontend and backend; let Mongoose enforce schema-level rules when possible.
35. Use `ULog` for persistent backend logging; do not leave raw console calls in backend application code.
36. Name shared API contracts with the `IAPI + Group + Description` pattern.
37. Preserve the existing frontend domain API delegation model.
38. Centralize API paths and routing paths in constants rather than hard-coding them.
39. Keep one-file helpers local, module-shared helpers with the module, and project-reusable helpers in utilities.
40. Do not invent new repository-wide patterns for areas explicitly left unresolved.
