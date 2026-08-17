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

The project uses prefixes to make the role of a structure immediately visible.

Core prefixes include:

| Prefix | Meaning |
|---|---|
| `C...` | React component |
| `P...` | Page or page-owned React content |
| `U...` | Utility-oriented file or structure |
| `T...` | Type or type-oriented structure |
| `I...` | Interface / data structure |
| `G...` | Global or base interface |
| `E...` | Centralized enum-like value structure |
| `S...` | Mongoose schema |
| `M...` | Mongoose model |
| `api...` | Frontend API function |

Use the prefix that describes the role of the structure, not simply its implementation type.

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

Event callbacks use the `on...` prefix.

This applies to:

- callback props;
- local event functions;
- event/signal handlers.

Do not mechanically rename event callbacks to `handle...`.

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

Named functions should explicitly declare their non-void return type.

Example:

```ts
function getName(): string {
	return "name";
}
```

`void` may be omitted when the function does not return a value.

Inline callbacks may rely on inference when appropriate.

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

Use `TODO` for intentionally unfinished or temporary work.

Example:

```ts
// TODO: Replace temporary implementation
```

No separate mandatory `TEMP` / `FIXME` convention is required.

---

## Constants and hard-coded values

### Constants

Meaningful fixed or reused values should generally become constants.

Do not over-police trivial literals.

Centralized value sets that are reused or authoritative can use `E...` enum-like structures.

A small stable local type-only value set can remain a union when centralization provides no real benefit.

### Environment variables

There is no rigid centralized configuration architecture.

Direct environment access is acceptable when a value is rare and local.

Repeated backend values may be exposed through the appropriate backend constants file.

When a new project environment variable is introduced, it should normally also be added to `default_env` with a safe, empty, or default value.

Secrets must not be committed.

Do not refactor environment handling solely for architectural purity.

---

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

Generated folders such as:

```text
dist/
```

must not be manually edited.

They are build/distribution output and should not be treated as authoritative project files.

Make changes in the source and regenerate the output.
