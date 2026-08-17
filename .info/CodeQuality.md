# Code Quality and Validation

<!-- TOC START -->
## Table of contents

- [Purpose](#purpose)
- [Recommended execution environment](#recommended-execution-environment)
- [Frontend validation](#frontend-validation)
- [Backend validation](#backend-validation)
- [Scope of validation](#scope-of-validation)
- [Formatting](#formatting)
- [Linting](#linting)
- [Generated build output](#generated-build-output)
- [Rules for contributors and agents](#rules-for-contributors-and-agents)
<!-- TOC END -->

## Purpose

Both frontend and backend are TypeScript projects and use the same basic quality workflow:

1. format the code;
2. run the linter;
3. run the full build.

A change should not be considered validated solely because ESLint succeeds. The TypeScript/build step can detect problems that linting does not.

---

# Recommended execution environment

The established workflow is to run npm validation commands **inside the relevant Docker development container**, from:

```text
/home/app
```

This ensures validation uses the controlled project environment rather than relying on whatever Node/npm versions happen to be installed on the host machine.

A typical interactive workflow is conceptually:

```bash
docker exec -it <container-name> sh
cd /home/app
```

Then run the relevant npm commands.

The exact container names are derived from the configured application name:

```text
${APP_NAME}-frontend
${APP_NAME}-backend-node
```

Running the scripts from the host may work when a compatible local toolchain is installed, but the Docker environment is the project reference environment.

---

# Frontend validation

From `/home/app` in the frontend container:

```bash
npm run format
npm run lint
npm run build
```

The frontend build currently runs:

```text
tsc -b && vite build
```

This verifies the TypeScript project and then performs the Vite build.

---

# Backend validation

From `/home/app` in the backend container:

```bash
npm run format
npm run lint
npm run build
```

The backend build currently runs:

```text
tsc
```

---

# Scope of validation

At minimum, validate every application side that was modified.

Examples:

- frontend-only implementation change -> validate frontend;
- backend-only implementation change -> validate backend;
- shared API/data contract change -> normally validate both frontend and backend;
- change to shared constants used by both sides -> normally validate both sides.

Because `.system/share.sh` can transform and regenerate backend shared files, shared-contract work should be validated **after synchronization**, not only before it.

---

# Formatting

Both applications use Prettier through:

```bash
npm run format
```

This command writes formatting changes to the working tree. Review those changes before committing or pushing so unrelated formatting changes are not accidentally included.

---

# Linting

Both applications expose:

```bash
npm run lint
```

through ESLint.

Lint success is required, but it is not a substitute for a successful build.

---

# Generated build output

`dist/` is distribution/build output only. It is generated from source by the build process, is ignored by Git, and is not an authoritative source tree.

Do not manually edit `dist/`, do not treat its contents as code to maintain, and do not commit generated `dist/` output. Make changes in the corresponding source files and regenerate the build when needed.

---

# Rules for contributors and agents

1. Do not report a TypeScript change as complete based only on visual inspection.
2. Do not treat lint success as proof that the application builds.
3. Run the full build for every modified application side.
4. Prefer the Docker environment for validation.
5. When shared contracts change, run synchronization first and validate both consumers afterward.
6. Review changes produced by `npm run format`; formatting is a write operation, not a read-only check.
7. Never manually maintain `dist/`; change source and regenerate it.
