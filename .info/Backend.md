# Backend

<!-- TOC START -->
## Table of contents

- [High-level folder model](#high-level-folder-model)
- [`middleware/`](#middleware)
- [`modules/`](#modules)
  - [`controller.ts`](#controllerts)
  - [`router.ts`](#routerts)
  - [`schema.ts`](#schemats)
    - [Schema `toJSON`](#schema-tojson)
    - [Schema/model conversion helpers](#schemamodel-conversion-helpers)
    - [Schema and global versions](#schema-and-global-versions)
    - [Hydrated documents and API serialization](#hydrated-documents-and-api-serialization)
  - [More complex modules](#more-complex-modules)
- [Middleware order](#middleware-order)
- [Error handling](#error-handling)
  - [API response contracts](#api-response-contracts)
  - [API error messages](#api-error-messages)
  - [HTTP success status codes](#http-success-status-codes)
- [Validation](#validation)
  - [Mongoose validation messages](#mongoose-validation-messages)
- [Logging](#logging)
- [Constants](#constants)
  - [API paths](#api-paths)
- [Environment variables](#environment-variables)
- [`types/`](#types)
  - [Synchronized API and data types](#synchronized-api-and-data-types)
- [`util/`](#util)
- [`src/`](#src)
  - [`src/index.ts`](#srcindexts)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## High-level folder model

The backend follows the same ownership split as the frontend:

```text
rgt/ = backend code intended to be shared across RGT applications
src/ = backend code specific to the current application
```

The cross-project ownership/import rules in [System.md](System.md) apply unchanged to backend code.

The current backend is intentionally compact and centered on middleware, modules, types, utilities, and the application entry point.

```text
backend/
├── rgt/
│   ├── middleware/
│   ├── modules/
│   ├── types/
│   └── util/
└── src/
    ├── types/
    └── index.ts
```

Additional constant/configuration files may exist under `src/` as guaranteed project integration points.

---

## `middleware/`

`middleware/` contains **all backend middleware**.

If middleware is created, configured, wrapped, or shared for the backend request pipeline, it belongs here.

Examples include authentication, validation, rate limiting, uploads, database/request preparation, and centralized error handling.

The rule is intentionally simple:

> If it is middleware, put it in `middleware/`.

---

## `modules/`

`modules/` contains backend functionality grouped by feature/domain.

For a normal database-backed feature, the default shape is:

```text
modules/
└── users/
    ├── controller.ts
    ├── router.ts
    └── schema.ts
```

Not every module needs every file. Use the structure according to the functionality actually required.

### `controller.ts`

Controllers contain the request-handling logic for the module.

Controller function names begin with the HTTP verb they handle:

```text
get...
post...
put...
patch...
delete...
```

For example: `getUserSelfFull`, `postUser`, `postAuth`.

Controllers currently access Mongoose models directly. Do not introduce a service/repository layer merely because another backend architecture would normally do so. No such repository-wide abstraction has been chosen.

### `router.ts`

Routers currently connect routes, middleware, and controllers.

The current pattern is deliberately simple, but this is **not yet a permanent architectural rule** for all future complex cases. Do not invent a new complex router architecture until a real requirement appears.

### `schema.ts`

When a module owns persistent data, `schema.ts` contains the Mongoose schema/model behavior associated with it.

Schema symbols use the `S...` prefix and Mongoose models use the `M...` prefix.

Example:

```ts
const SUser = new Schema(...);
const MUser = model(...);
```

#### Schema `toJSON`

Every schema should define the appropriate `toJSON` transformation by default.

The application uses MongoDB-native IDs and may use database-managed timestamps such as `createdAt`/`updatedAt`. Serialization must normalize those database-specific values into the application data structures expected by the shared TypeScript contracts.

`toJSON` is therefore part of the frontend/backend/database data contract, not cosmetic formatting.

#### Schema/model conversion helpers

When a database document needs one or more reusable application-facing representations, the conversion logic should live with the schema/model rather than being rebuilt inside controllers.

This is relatively uncommon and is currently most visible for users, where one document can have different public/private/base/full representations.

Keep controllers focused on request handling instead of repeating large document-conversion logic. If a future conversion becomes substantially larger and assembles data from several database areas, use a dedicated builder/maker-style structure rather than bloating either the controller or schema. The exact large-builder architecture is chosen when such a case exists.

#### Schema and global versions

Persistent schemas carry two version concepts:

- `schemaVersion` is the local version of that specific schema/data structure;
- `globalVersion` is the version of the overall shared/global data format.

A schema may evolve independently through its own `schemaVersion`. A `globalVersion` change is broader and is intended to signal that stored data may require a general update pass.

The actual migration/update framework is not defined yet. The likely future direction is a startup-time database/version check, but contributors must not invent a migration architecture until it is explicitly designed.

#### Hydrated documents and API serialization

Mongoose query results are normally kept as hydrated documents inside backend/database logic because document behavior such as `.save()` and schema/model methods may still be needed.

Plain/shared interfaces represent serialized application/API data. **Never return a hydrated Mongoose document directly through the API.** Convert it to the shared contract first, normally through `toJSON()` or an appropriate schema/model conversion method.

This separation lets backend code retain Mongoose behavior without leaking database document internals into shared API contracts.

### More complex modules

The project has not yet established a universal structure for modules that become substantially more complex than the current controller/router/schema pattern.

Do not pre-emptively add service, repository, manager, use-case, or other layers. Add new architectural layers only when a real module requires them and the project deliberately chooses the convention.

---

## Middleware order

There is currently **no project-wide middleware-order convention** beyond actual Express/middleware technical requirements.

Preserve ordering when a middleware's behavior requires a particular position. For example, centralized error handling must be positioned so it can receive errors from the routes/middleware it is intended to handle.

Do not document or enforce the current line-by-line registration order as architecture merely because it happens to be the present order. Additional ordering rules can be defined later if real cases require them.

---

## Error handling

Backend error handling is centralized.

Controllers and middleware normally throw an error structure and let the common error middleware build the HTTP response.

Example:

```ts
throw {
    code: 404,
    message: "User not found",
};
```

Do not manually build error responses in every controller by default.

Local `try/catch` is acceptable when an operation genuinely needs local recovery/translation, but it is the exception rather than the normal error flow.

### API response contracts

On success, controllers return the actual shared `IAPI...` payload defined for that endpoint. The shared API contract is the HTTP response body; do not add a generic backend response envelope merely because the frontend generic Axios helpers use `IAPIData` internally.

On failure, the centralized error path returns the shared API error contract.

### API error messages

The thrown/returned API `message` is primarily intended for frontend/user-facing consumption. Keep it useful without exposing internal implementation details such as stack traces, database internals, collection names, or other server-only information.

`errorInfo` is currently a narrow complementary field rather than a general diagnostic container. Its existing use is duplicate-key handling: the backend can attach the conflicting `keyValue` information so the frontend can identify the relevant existing field/value. Do not place stack traces, database internals, collection details, or arbitrary debug state in `errorInfo`, and do not generalize it into a broader error architecture without a real requirement.

A possible future extension is a separate local/internal logging message field when backend diagnostics need more detail. That is only an idea; it is **not** an implemented error-contract requirement.

### HTTP success status codes

The exact successful `2xx` status is not a strict project concern. Use the semantically appropriate status when practical, but returning `200` where `201` might also be reasonable is not considered a meaningful architecture/style problem.

Error status codes matter more and should accurately represent the failure.

---

## Validation

Backend validation is still required even when the frontend already validates the same input.

When Mongoose can enforce a rule cleanly through the schema, let Mongoose enforce it.

When the rule is outside Mongoose's normal schema validation capability, add explicit backend validation logic/handlers, as with password restrictions.

The backend never treats frontend validation as trusted security/data validation.

### Mongoose validation messages

Mongoose's default validation messages are acceptable. Add custom schema validation messages only when a more specific or useful message is actually needed.

Do not systematically replace every Mongoose validation message with project-authored text.

---

## Logging

Persistent backend logging uses the shared `ULog` system.

Backend code should log meaningful runtime operations sufficiently to make server behavior understandable during development and maintenance.

Do not leave raw `console.log`, `console.error`, or similar calls in normal backend application code. Such calls usually indicate temporary debugging or code that still needs cleanup. Console output inside the `ULog` implementation itself is naturally allowed.

The current user/auth code may not yet contain as much permanent logging as the intended convention requires. That current gap should not be interpreted as the standard.

---

## Constants

Shared constants flow from frontend to backend through the sharing system. A backend copy of synchronized `consts.ts` is therefore not the right place for backend-only constants.

Use the backend-specific constants file for backend-exclusive values, for example:

```text
backend/src/backendConsts.ts
```

The distinction is:

```text
consts.ts         = intentionally shared frontend/backend constants
backendConsts.ts  = backend-only constants
```

If the frontend later needs an equivalent set of frontend-only constants, a dedicated frontend-only mechanism can be introduced when there is a real need.

### API paths

All backend endpoints/call paths are centralized in the shared API-path constants. Backend routers and frontend API handlers should consume the same definitions rather than independently hard-coding matching strings.

---

## Environment variables

There is no strict rule that every environment variable must first be copied into `backendConsts.ts`.

Direct `process.env...` access is acceptable for isolated/rare usage. Frequently reused values may be centralized when that improves readability and consistency.

Do not refactor existing environment access merely to satisfy an abstract configuration pattern.

---

## `types/`

Backend types follow the same general extraction rules as frontend types:

- keep a type local when it belongs naturally to one implementation;
- extract it when reuse, generic scope, contract ownership, or file complexity justifies it.

### Synchronized API and data types

The following contract folders are synchronized from frontend to backend:

```text
frontend/src/types/api   -> backend/src/types/api
frontend/src/types/data  -> backend/src/types/data

frontend/rgt/types/api   -> backend/rgt/types/api
frontend/rgt/types/data  -> backend/rgt/types/data
```

The backend copies are derived and are **not authoritative**. Contract changes must be made in the frontend source and then synchronized.

---

## `util/`

`util/` contains backend helpers that do not naturally belong to a more specific architectural folder.

It is a fallback category, not a dumping ground. Middleware, module logic, types, logging infrastructure, and other code with a clear home should remain in their dedicated areas.

---

## `src/`

`backend/src/` contains backend code specific to the current application.

At present this side is intentionally small and includes the application entry point, project-specific backend types where needed, and guaranteed integration/configuration files supplied by the shared system.

### `src/index.ts`

`src/index.ts` is the application-specific backend entry point. It creates/configures the Express application, installs middleware, mounts module routers, initializes required backend services, and starts the server.

A future database migration/version check will likely be triggered around backend startup, but that architecture is not yet defined.

---

## Rules for contributors and agents

1. Apply the same `rgt/` versus `src/` ownership rules used throughout the repository.
2. Do not introduce arbitrary `rgt -> src` dependencies.
3. Put all middleware in `middleware/`.
4. Organize backend functionality by feature/domain under `modules/`.
5. Use the controller/router/schema structure for straightforward modules when those responsibilities are needed.
6. Prefix controller functions with their HTTP method.
7. Use `S...` for schemas and `M...` for Mongoose models.
8. Give every schema the appropriate `toJSON` transformation by default.
9. Keep reusable document-to-application conversions with the schema/model; use a dedicated builder/maker only when composition becomes substantially larger or cross-database.
10. Preserve `schemaVersion` and `globalVersion`; do not invent the future migration framework yet.
11. Let controllers use Mongoose models directly under the current architecture; do not add service/repository layers without a real requirement.
12. Treat current thin routers as the current pattern, not an immutable future architecture.
13. Preserve middleware order when a concrete Express/middleware requirement demands it; otherwise do not invent an ordering convention.
14. Throw errors into the centralized error system rather than manually building error responses by default.
15. Validate backend input even when the frontend already validated it; use Mongoose validation when possible.
16. Use `ULog` for persistent backend logging; remove raw console debugging from finished backend code.
17. Put backend-only constants in `backendConsts.ts`, not in synchronized `consts.ts`.
18. Use centralized shared API-path constants instead of hard-coded endpoint strings.
19. Direct environment access is acceptable when local; centralize it only when reuse/readability justifies it.
20. Treat synchronized `types/api/` and `types/data/` as frontend-owned contracts.
21. Validate backend work with format, lint, and build before considering it complete.
22. Keep Mongoose results hydrated when document behavior is useful, but never return hydrated documents directly through the API; serialize to shared contracts first.
23. Accept Mongoose default validation messages unless a custom message is genuinely more useful.
24. Return the endpoint's shared `IAPI...` contract directly on success; `IAPIData` is not a backend response envelope.
25. Keep API error messages frontend/user-safe and free of internal server/database details; keep `errorInfo` narrow and frontend-useful rather than using it for server debugging.
26. Treat exact successful `2xx` choices as secondary; choose accurate error status codes carefully.
