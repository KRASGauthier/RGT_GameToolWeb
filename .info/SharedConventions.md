# Shared Conventions

> Conventions that apply across both the frontend and backend codebases.

## Table of contents

- [Naming](#naming)
  - [Prefixes](#prefixes)
  - [Files and exports](#files-and-exports)
  - [Functions](#functions)
  - [API contract names](#api-contract-names)
  - [Generic parameters](#generic-parameters)
- [TypeScript](#typescript)
  - [`interface` vs `type`](#interface-vs-type)
  - [Function return types](#function-return-types)
  - [`any`](#any)
  - [Casts](#casts)
  - [`null` vs `undefined`](#null-vs-undefined)
  - [Optional chaining](#optional-chaining)
  - [Fallback operators](#fallback-operators)
- [Functions and control flow](#functions-and-control-flow)
  - [Function declarations vs arrows](#function-declarations-vs-arrows)
  - [Async style](#async-style)
  - [Guard clauses](#guard-clauses)
  - [One-line `if`](#one-line-if)
  - [Equality](#equality)
- [Imports](#imports)
  - [Relative imports](#relative-imports)
  - [`import type`](#import-type)
  - [Import ordering](#import-ordering)
  - [Unused imports](#unused-imports)
- [Code organization](#code-organization)
  - [Local vs shared helpers](#local-vs-shared-helpers)
  - [Utilities](#utilities)
  - [Section comments](#section-comments)
  - [`TODO` comments](#todo-comments)
- [Constants and hard-coded values](#constants-and-hard-coded-values)
  - [Constants](#constants)
  - [Environment variables](#environment-variables)
- [General principles](#general-principles)
  - [Avoid unnecessary abstractions](#avoid-unnecessary-abstractions)
  - [Respect existing architecture](#respect-existing-architecture)
  - [Refactoring existing code](#refactoring-existing-code)
  - [Generated files](#generated-files)

---
## Naming

### Prefixes

The project uses prefixes when the role of an exported/shared structure benefits from being immediately visible.

Core prefixes include:

| Prefix | Meaning |
|---|---|
| `C...` | React component |
| `P...` | Page or page-owned React content |
| `U...` | Utility-oriented file/structure |
| `T...` | Type or type-oriented structure |
| `I...` | Interface / data structure |
| `G...` | Global/base interface |
| `E...` | Centralized enum-like value structure |
| `S...` | Exported/shared Mongoose schema |
| `M...` | Exported Mongoose model |
| `api...` | Frontend API function |

Prefixes are mainly valuable where names cross file/module boundaries.

Local/private implementation variables do not need a prefix solely to satisfy a naming pattern.

For Mongoose specifically:

```text
const projectSchema = ...
export const SSharedSchema = ...
export const MProject = ...
```

The `S...` prefix was dropped for ordinary local/private schema variables. Use it when the schema itself is exported/shared.

The `M...` prefix is the current standard for exported Mongoose models. Existing older exports do not need rename-only cleanup.

### Files and exports

When a file is dedicated to one primary structure, the filename and main export should match when practical.

This is expected for dedicated component and page files.

Default exports are preferred when a file exists mainly for one primary thing.

Named exports are natural when a file intentionally contains several meaningful exports, such as:

- utilities;
- hooks;
- API functions;
- style helpers;
- controllers;
- shared types.

### Functions

General function names should describe what the function does.

Frontend callback **props** use the `on...` convention:

```ts
onClick
onChange
onDelete
onSendEdit
```

Local functions that handle those callbacks/events normally use descriptive `handle...` names:

```ts
handleCreate
handleChange
handleDelete
handleSendEdit
```

A local function can still use another descriptive name when `handle...` adds no value.

Do not force backend/domain functions into event-handler naming. Their names should describe their module and action according to the backend conventions.

### API contract names

Shared API contract names follow:

```text
IAPI + Group + Description
```

Example:

```ts
IAPIUserCheckAvailable
```

Keep names short but explanatory.

Do not automatically add `Request` / `Response` suffixes when the operation name already makes the distinction clear.

Separate request/response names or suffixes such as `Rcv` can still be used when they genuinely improve clarity.

### Generic parameters

Generic/template parameters always begin with `_`.

Single/default generic:

```ts
_T
```

Multiple generics should remain descriptive:

```ts
_TInput
_TOutput
_TValue
```

---

## TypeScript

### `interface` vs `type`

Use `interface` by default for ordinary structured object/data definitions.

Example:

```ts
interface IUser {
	uid: string;
	name: string;
}
```

Use `type` when the structure is naturally a type expression, such as:

- unions;
- aliases;
- discriminated unions;
- compositions;
- mapped or combined types.

General tendency:

```text
structured data
→ interface

type expression
→ type
```

### Function return types

Named functions should explicitly declare return types whenever practical.

Preferred:

```ts
function getName(): string {
	return "name";
}
```

The goal is to make return contracts visible without making signatures unusably noisy.

It is acceptable to rely on inference when the explicit type would be excessively large, awkward, or implementation-heavy, for example some complex Mongoose hydrated-document return types.

Inline callbacks can rely on inference when the type is obvious from context.

For named functions, explicit typing should still be used as much as reasonably possible.

### `any`

Explicit `any` is forbidden.

Use:

- a real type;
- a generic;
- `unknown`;

depending on the situation.

Do not use `any` simply to silence TypeScript.

### Casts

Normal casts are acceptable when the developer knows the actual runtime type.

Example:

```ts
value as IUser
```

Strongly avoid:

```ts
value as unknown as IUser
```

Use double-casting only when TypeScript is blocking a genuinely valid case and there is no cleaner practical option.

### `null` vs `undefined`

Use:

```text
undefined
```

for something that is unset, absent, or not provided.

Use:

```text
null
```

for an explicit, meaningful no-value / no-entity state.

`null` is considered an actual value.

### Optional chaining

Optional chaining is allowed.

When missing data means execution should stop, prefer an explicit guard:

```ts
if (!user) return;

user.name;
```

rather than continuing through repeated optional chaining.

Use `value!` only when the value is genuinely known to exist.

Do not use non-null assertions merely to silence TypeScript.

### Fallback operators

There is no rigid fallback-operator rule.

Use the operator that best matches the logic.

General tendencies include:

- default parameters;
- `??`;
- explicit boolean checks;
- `||` when its truthiness behavior is actually desired.

Prefer an explicit condition when it makes the intent clearer.

---

## Functions and control flow

### Function declarations vs arrows

Both function declarations and arrow-function constants are accepted for general functions.

General tendency:

```text
important / standalone / outside function
→ function declaration

local callback / variable-like function
→ arrow function
```

Use whichever form is technically useful when necessary.

React component declarations follow their own frontend convention.

### Async style

Prefer:

```ts
async / await
```

throughout the project.

Avoid normal `.then()` / `.catch()` chains.

Promise chains may still appear at a root/boundary of asynchronous execution when there is a concrete reason.

### Guard clauses

Avoid deep indentation.

Prefer early returns and guard clauses.

Example:

```ts
if (!user) return;

doSomething(user);
```

rather than wrapping the entire function body in nested conditions.

### One-line `if`

A one-line `if` should normally omit braces.

Preferred:

```ts
if (!user) return;
```

Use braces for multi-statement blocks.

### Equality

The default project preference is:

```ts
==
!=
```

Do not mechanically replace equality checks with:

```ts
===
!==
```

Use strict equality when coercion ambiguity could cause a real bug or when there is a technical reason for it.

---

## Imports

### Relative imports

Relative imports are the current project convention.

Do not introduce path aliases unless the project deliberately adopts them.

Let the editor/tooling generate imports normally.

### `import type`

Use `import type` where TypeScript or tooling requires/generates it.

There is no requirement to manually rewrite every type-only import solely for style.

### Import ordering

There is no manual import-ordering convention.

Do not spend time reorganizing imports purely for appearance.

### Unused imports

Unused imports must be removed.

TypeScript and linting are expected to catch them.

---

## Code organization

### Local vs shared helpers

Place helpers according to their real scope.

General rule:

```text
used by one file only
→ keep local

shared inside one module/domain
→ module-specific helper/shared file

reusable or plausibly reusable across the project
→ utility/shared location
```

Do not move every small helper into a global utility folder.

### Utilities

Utility files are for generic or reusable helpers.

A helper should not become a utility merely because it could theoretically be extracted.

Keep local implementation details close to the code that owns them.

### Section comments

Section comments are used to improve readability in larger files.

Major section:

```ts
//--------------------------------------------------
//                      NAME
//--------------------------------------------------
```

Important subsection:

```ts
//====================== NAME ======================
```

Smaller section:

```ts
//--------------------- NAME ---------------------
```

Tiny/local marker:

```ts
//DATA
```

Choose the level based on the amount and importance of the section.

Do not add section comments mechanically to every small file.

### `TODO` comments

Use `TODO` comments for small, local unfinished work that belongs next to the code.

Example:

```ts
// TODO: Replace temporary implementation
```

Project-level technical tasks that should survive beyond one source file belong in the root:

```text
todo.md
```

Do not scatter the same project-wide task across multiple source comments.

## Constants and hard-coded values

### Constants

Meaningful fixed or reused values should generally become constants.

Do not over-police trivial literals.

Centralized value sets that are reused or authoritative can use `E...` enum-like structures.

A small stable local type-only value set can remain a union when centralization provides no real benefit.

### Environment variables

There is no rigid centralized configuration architecture.

Direct environment access is acceptable when a value is rare and local.

Repeated backend values may be exposed through an appropriate backend constants file.

`default_env` contains shareable/default environment structure.

The real `.env` contains environment-specific/private values.

`.env` is intentionally included in the private/local RGT synchronization baseline, but it must not be committed to Git or treated as public/shareable project documentation.

JWT secrets are intentionally provisioned through the real environment. Rotating production JWT secrets invalidates active JWT sessions.

Do not refactor environment handling solely for architectural purity.

## General principles

### Avoid unnecessary abstractions

Do not introduce abstractions simply because they are common elsewhere.

Add a layer when the project actually benefits from it.

Examples include avoiding unnecessary:

- service/repository layers;
- routing wrappers;
- generic helper layers;
- configuration systems;
- premature factories/builders.

Prefer the simplest structure that fits the current problem.

### Respect existing architecture

The documented architecture and conventions describe how new work and refactoring should be approached.

Do not "clean up" an intentional project pattern solely because another architecture is more conventional.

This is especially important for unusual but deliberate project choices.

### Refactoring existing code

Existing code does not need to be proactively rewritten only because it does not yet follow every current convention.

When modifying or refactoring an area:

- follow the current documented convention;
- clean nearby inconsistencies when useful;
- do not expand the task into unrelated cleanup unless there is a practical reason.

The documentation will continue evolving with the project.

### Generated files

Generated output is not source code.

This includes build output such as:

```text
dist/
```

and backend files synchronized/generated by:

```bash
make share
```

The frontend is authoritative for synchronized API/data/icon contracts and shared constants.

Do not manually edit a synchronized backend copy expecting the change to survive.

Edit the frontend source of truth and regenerate the backend representation.

