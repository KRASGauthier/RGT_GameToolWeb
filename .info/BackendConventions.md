# Backend Conventions

> Backend-specific coding conventions for Game Tool.  
> Generic TypeScript and cross-project rules belong in `SharedConventions.md`.

## Table of contents

- [Modules](#modules)
  - [Organization](#organization)
  - [Routers](#routers)
  - [Controllers](#controllers)
- [Mongoose](#mongoose)
  - [Schema and model naming](#schema-and-model-naming)
  - [Document typing](#document-typing)
  - [Validation](#validation)
  - [Serialization](#serialization)
  - [Model conversion methods](#model-conversion-methods)
  - [Schema versions](#schema-versions)
- [Constants](#constants)
- [Middleware](#middleware)
- [Errors](#errors)
  - [Centralized error handling](#centralized-error-handling)
  - [Thrown errors](#thrown-errors)
  - [`errorInfo`](#errorinfo)
  - [HTTP status codes](#http-status-codes)
- [Logging](#logging)
- [API](#api)
  - [Shared contracts](#shared-contracts)
  - [Success responses](#success-responses)
  - [Error responses](#error-responses)
  - [API paths](#api-paths)
- [Validation](#validation-1)

---

## Modules

### Organization

Backend functionality is grouped by domain.

A typical simple database-backed module may contain:

```text
module/
├── controller.ts
├── router.ts
└── schema.ts
```

This is the normal lightweight structure.

Do not introduce a service/repository architecture merely for architectural purity.

Controllers directly using Mongoose are acceptable and are part of the current backend architecture.

Split controllers or support files only when the module has genuinely become large or complex enough to justify it.

### Routers

Routers connect:

- centralized API paths;
- middleware;
- controller functions.

The current pattern is generally:

```text
route
 ↓
middleware
 ↓
controller
```

Keep routers thin when practical.

Do not treat the current router shape as an immutable architectural law. The important point is that route wiring remains clear and does not absorb unrelated business logic.

### Controllers

Controller function names begin with the HTTP verb they handle:

```text
get...
post...
put...
patch...
delete...
```

Examples:

```ts
getUser
postUser
patchUser
deleteUser
```

Controllers contain request-specific backend logic and may interact directly with Mongoose.

Avoid unnecessary abstraction layers between the controller and the database.

---

## Mongoose

### Schema and model naming

Mongoose-specific prefixes are:

```text
S...  → Mongoose schema
M...  → Mongoose model
```

These prefixes are reserved specifically for Mongoose schema/model structures.

### Document typing

Mongoose query results should normally remain hydrated documents when document behavior may be useful.

This preserves access to functionality such as:

```text
.save()
custom schema/model methods
document state
```

Use shared/plain interfaces for serialized application or API data.

Never return a hydrated Mongoose document directly through the API.

### Validation

If Mongoose can naturally enforce a database rule, prefer using the schema validation.

Examples include:

- required values;
- enums;
- length/range constraints;
- uniqueness where supported through indexes;
- other schema-level constraints.

Use explicit backend validation when the rule does not belong naturally in Mongoose.

Mongoose default validation messages are acceptable.

Custom validation messages are optional and should only be added when a more specific or useful message is needed.

Do not systematically replace every Mongoose validation message.

### Serialization

Every schema should normally provide the appropriate `toJSON` transformation required to match the application's shared contracts.

Common normalization includes:

```text
_id
 ↓
uid
```

and timestamps or other MongoDB-specific structures where relevant.

The objective is that serialized database output matches the shared API/data representation expected by the rest of the application.

Sensitive or internal database data must not be exposed merely because it exists on the Mongoose document.

### Model conversion methods

When a model needs several standard representations, conversion methods belong with the schema/model rather than inside controllers.

Examples can include representations such as:

```text
base
public
private
full
```

This is a specialized pattern and should only be used when the model genuinely benefits from it.

User data is the main current example.

Do not create builder/conversion layers for every schema by default.

### Schema versions

Database-backed shared structures may use:

```text
schemaVersion
globalVersion
```

`schemaVersion` identifies the version of that specific/local schema.

`globalVersion` identifies the global/shared data-format version.

No migration framework is currently established.

Do not invent or document a migration implementation that does not yet exist.

---

## Constants

Shared frontend/backend constants originate on the frontend and are synchronized to the backend.

Backend-only constants belong in:

```text
backendConsts.ts
```

Direct `process.env` access is acceptable for rare/local environment values.

If a backend environment value is used repeatedly, placing it in `backendConsts.ts` can be appropriate.

Do not introduce a centralized configuration architecture solely for purity.

---

## Middleware

Middleware belongs in the appropriate backend middleware area.

There is no broad project rule forcing one universal middleware order.

Order should follow actual Express requirements and the behavior being implemented.

For example, error middleware must be placed where Express can correctly receive propagated errors.

Do not invent ordering conventions where the framework does not require one.
## Errors

### Centralized error handling

Backend errors are handled centrally.

Controllers and middleware should normally raise an error and let the common error middleware build the HTTP response.

This keeps response formatting and common error behavior in one place.

Use local `try/catch` only when the current function needs to:

- recover locally;
- transform the error;
- add meaningful local behavior;
- handle a specific known case.

Do not wrap every controller in `try/catch` automatically.

### Thrown errors

Application errors normally follow the simple shape:

```ts
throw {
	code: 400,
	message: "Invalid value",
};
```

`code` is the HTTP error status.

`message` is primarily intended for frontend/user-facing consumption.

Do not expose internal implementation details such as:

- stack traces;
- database internals;
- collection names;
- server filesystem details;
- other private debugging information.

### `errorInfo`

`errorInfo` is optional complementary structured information attached to an API error.

Its current usage is narrow, especially for cases such as duplicate database values where the frontend needs additional information about what already exists.

For example, database duplicate-key information may be converted into useful structured data for the frontend.

Do not treat `errorInfo` as a general backend debugging container.

### HTTP status codes

Error status codes should accurately represent the failure.

Correct error status codes matter.

Successful `2xx` codes are less strict.

Use the appropriate success status when practical, but differences such as `200` vs `201` are not considered major project issues.

---

## Logging

Permanent backend runtime logging uses `ULog`.

Meaningful operations should be logged enough to understand what the backend is doing.

Use logging for useful runtime information such as:

- important operations;
- startup/system state;
- meaningful failures;
- major backend actions.

Raw:

```ts
console.log(...)
console.error(...)
```

should not remain as permanent backend logging outside the `ULog` implementation.

Treat direct console output elsewhere as temporary debug residue.

---

## API

### Shared contracts

Shared API contracts live in:

```text
types/api/
```

They are authoritative for both frontend and backend.

Do not redefine the same request or response payload independently on the backend when a shared contract already exists.

Shared API contract naming follows:

```text
IAPI + Group + Description
```

For example:

```ts
IAPIUserCheckAvailable
```

Keep names short but explanatory.

Do not mechanically add `Request` / `Response` suffixes when the operation name already makes the distinction clear.

Separate request/response structures or suffixes such as `Rcv` can still be used when they genuinely improve clarity.

### Success responses

On success, the backend returns the actual requested shared `IAPI...` payload.

Conceptually:

```ts
res.status(200).json(apiPayload);
```

The payload should conform to the relevant shared API contract.

Do not wrap successful backend responses in frontend-only helper structures such as `IAPIData`.

### Error responses

On failure, the backend returns the common API error structure produced through the centralized error system.

The error `message` is intended for frontend/user-facing handling.

Internal debugging information should remain in backend logs rather than being exposed through the API response.

### API paths

Backend API endpoint paths must be centralized in shared constants.

Do not scatter hard-coded endpoint strings through routers/controllers.

Frontend routes and backend API routes have their own centralized constant structures.

---

## Validation

Frontend validation exists for UX.

Backend validation is authoritative for trust and persistence.

Every value received from the frontend must be validated again on the backend where relevant.

General tendency:

```text
Mongoose can enforce it naturally
→ schema validation

Mongoose is not the right place
→ explicit backend validation
```

Never trust frontend validation as sufficient backend protection.

---

