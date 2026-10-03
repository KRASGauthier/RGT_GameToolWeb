# Bug Feature

## Goal

Implement the project Bug Management feature: a bug list page and a bug detail page.

This document is intentionally limited to requirements discussed for the feature and directions already established by the current source code. Do not invent additional product behavior, API routes, storage layouts, permissions, or data architecture unless implementation requires a decision.

The **current source code is authoritative**. Existing documentation may be outdated.

## Current source references

Before implementing, use the existing code as the reference for project conventions, especially:

- `frontend/src/App.tsx` and `frontend/src/consts.ts` for frontend routing.
- `frontend/src/pages/projects/PProjectNav/PProjectNav.tsx` for project navigation and project sections. The Bugs menu entry already exists but does not yeSt render a bug page.
- `frontend/src/pages/projects/PProjectGroups/PProjectGroups.tsx` as a practical example of a project page using project context, `CFilter`, filtering/sorting, API calls, and `CStack`.
- `frontend/rgt/components/inputs/filters/CFilter.tsx` for the reusable filter component.
- `frontend/rgt/components/images/CImage.tsx` and `CDialogImage.tsx` for image display, expansion, and editing.
- `frontend/rgt/components/layout/CStack.tsx` for styled stack containers.
- The existing project/group backend modules and frontend API files for coding conventions only. **The bug API design itself is intentionally left to the implementation.**

Do not confuse frontend page routing with backend API routing.

---

## Implementation order

1. Define the bug data/types required by the feature and implement the backend support needed to persist them.
2. Create the missing reusable RGT slider and progress components.
3. Extend `CFilter` only where needed for the bug page.
4. Implement the project bug list page.
5. Implement the bug detail page and its frontend route.
6. Implement bug logs/status behavior.
7. Implement bug images using `CImage`.
8. Finish filtering, sorting, best-resolve calculation, and priority colors.

The exact backend endpoints, controllers, schema organization, image storage structure, and API call breakdown are implementation decisions. Follow the current project architecture rather than this document inventing a new one.

---

# 1. Bug data requirements

A bug belongs to a project and needs enough persisted data to support the UI below.

Required information:

- MongoDB/internal bug UID.
- Human-readable bug number.
- Name.
- Multiline description.
- Images.
- Creation date.
- Importance.
- Difficulty.
- Best-resolve date/value.
- Current status.
- Bug logs/history.

## Bug identifiers

There are two different identifiers and both must be visible on the bug detail page.

### Internal UID

Use the MongoDB-generated ID as the internal bug UID. This is the identifier used by the frontend bug detail route.

### Human bug number

Each newly created bug also receives a simple incrementing number. This exists so bugs can be referenced easily outside the database, for example in a changelog: `Bug #62`.

Store the number itself and format it for display in the UI. The exact counter implementation is left to the backend implementation; it must reliably produce the next bug number when a new bug is created.

## Creation date

The creation date is automatic. The current backend already uses Mongoose schemas with `timestamps: true`; use the same mechanism for bugs rather than asking the user for a creation date.

---

# 2. Reusable RGT components to create

These components **do not currently exist**. Do not spend time searching for them.

Both belong in `frontend/rgt` because they are reusable application components, not bug-specific components.

## `CSlider`

Create a reusable RGT slider component following the existing RGT component/style conventions.

It will be used on the bug page for:

- Importance: value out of 10.
- Difficulty: value out of 10.

Keep the component generic. Its exact reusable prop API should follow the patterns already used by other RGT input wrappers.

## `CProgress`

Create a reusable RGT progress component following the same principle.

It will be used to visualize the bug status progression:

`Not treated -> Checked -> Found -> Fixed -> Patched`

The component itself must remain generic; bug-status interpretation belongs to the bug feature.

---

# 3. Frontend routing

The current project routing is built around:

`/project/:tab/:section?`

For this feature, the general bug list is the Bugs project section:

`/project/:tab/bugs`

Opening a bug must add that bug's **internal MongoDB UID** to the frontend route:

`/project/:tab/bugs/:bugId`

The human bug number is for display/search/reference and is **not** the route identifier.

Extend the existing frontend routing cleanly to support the additional bug parameter. This section describes page routing only; it does not define backend API endpoints.

---

# 4. Bug list page

The Bugs section should display the project's bugs.

Main structure:

- `CFilter` at the top.
- Add button/action for creating a bug.
- Bug list below.
- Clicking a bug opens its bug detail route.

A bug entry should expose the useful summary information available from the design, including its human bug number and short name, with status/priority information where appropriate.

## Filter and sort

Use the existing `CFilter`. Do not create a separate bug-only filter system.

The page needs useful filtering and/or sorting around:

- Name.
- Creation date.
- Best resolve.
- Importance.
- Difficulty.
- Status.

There are two distinct behaviors:

- **Filter:** hides entries that do not match.
- **Sort:** changes list order without hiding entries.

`CFilter` currently supports text and sort entries. Extend the reusable component when additional entry behavior is required, while keeping existing usages such as `PProjectGroups` working.

The exact controls used for each field are an implementation/UI decision.

## Add bug

The Add action creates a new bug and assigns its next human bug number. Use the project's existing component/API patterns rather than introducing an unrelated workflow.

## Priority color

Importance must be immediately visible in the list.

- Lower importance should visually tend toward green.
- Higher importance should visually tend toward red.
- Intermediate importance should transition appropriately between them.
- **Patched bugs are the exception:** once patched, display them in a neutral/grey style so they no longer attract attention.

A bug that is only **Fixed** is not the same as Patched: the fix exists in development but has not necessarily reached users yet, so it should not receive the completed/grey treatment solely because it is Fixed.

Use the existing theme/style system instead of arbitrary isolated styling.

---

# 5. Bug detail page

The page follows the two-column direction from the provided mockup.

## Left side: bug information

Display near the top:

- Current human bug number, e.g. `Bug #62`.
- Current internal bug UID.

Then provide:

- Editable short bug name.
- Editable multiline description.
- `Images` section.

The description is intended for detailed bug information such as what was tested, reproduction steps, what triggered the problem, observations, and any other useful context. It must support many lines.

Reuse the existing RGT text-field components rather than raw MUI inputs where an RGT wrapper already exists.

## Images

Below the `Images` label, display a grid of bug images plus a separate `+` button for adding another image.

Do **not** use an empty `CImage` as the add-image control.

For existing images, use `CImage` and its existing behavior:

- Display the image.
- Allow expansion/zoom.
- Allow replacement/editing when enabled.

The missing behavior is deletion. Add a reusable way to delete an image from the expanded image view. This may require extending `CImage` / `CDialogImage`, or using their existing extension points if that produces a clean reusable result.

Do not replace `CImage` with a custom bug-specific image upload/display implementation.

The backend/API/storage details needed for add/replace/delete are left to the implementation.

## Right side: metadata and history

Display:

- Creation date.
- Best resolve.
- Importance slider.
- Difficulty slider.
- Current status and progress visualization.
- Add-log controls.
- Existing log history.

Use normal MUI `Stack`, `Grid`, etc. for layout-only purposes.

Use `CStack` only when a section should receive the styled container/background treatment. `CStack` is not required merely to align elements.

---

# 6. Importance, difficulty, and best resolve

Both Importance and Difficulty are values out of 10.

- **Importance:** how important/urgent the bug is.
- **Difficulty:** how difficult or time-consuming it is expected to be to resolve.

`Best resolve` is calculated from those values:

- Higher importance should move the recommended resolution date sooner.
- Higher difficulty should allow more time.

The exact ratio/formula is intentionally left to the implementation, but keep the calculation centralized so it can be adjusted later without rewriting the feature.

The result must be usable for display and sorting on the bug pages.

---

# 7. Status and bug logs

The status progression is:

`Not treated -> Checked -> Found -> Fixed -> Patched`

Meaning:

- **Not treated:** no meaningful treatment/progress has been recorded yet.
- **Checked:** the bug has been checked/investigated.
- **Found:** the reason/cause has been found.
- **Fixed:** the bug has been fixed in the development environment.
- **Patched:** the fix has been deployed/released to real users.

Example: fixing a game bug locally makes it `Fixed`; publishing the update so Steam/users receive that fix makes it `Patched`.

The status progress bar should visually represent this progression.

## Logs

The detail page contains a log history. Each displayed log contains:

- Type.
- Description/info.
- Automatic date.

The add-log area contains:

- Description/info input.
- Type dropdown.
- Add-log button.

Choose a practical reusable set of log types during implementation. Types should cover the useful cases discussed, such as checking a bug, finding its cause, recording an issue/blocker, fixing it, patching it, and informational notes where useful.

Status-changing log types must update the bug status automatically. For example, adding a `Fixed`-type log changes the bug status to Fixed; adding a `Patched`-type log changes it to Patched. A non-status informational type does not need to change the status.

A patch log can contain release information in its description, for example `Patched in version 3.1`.

Do not add a separate manual status control unless implementation genuinely requires one; the intended workflow is driven by logs.

---

# 8. Backend/API direction

Implement whatever backend/API support is necessary for the feature, following the patterns already present in the current source code for projects, groups, shared types, API checkers, controllers, routers, middleware, and frontend API helpers.

**Do not treat `/project/:tab/bugs/...` as an API route. It is frontend application routing.**

This specification deliberately does **not** prescribe:

- Specific bug API URLs.
- Specific HTTP methods per bug operation.
- Whether logs are embedded or separate documents.
- How the incrementing bug number is internally allocated.
- Exact image filesystem/storage layout.
- Whether calculated values are stored or derived.

Those are implementation decisions for the developer/agent after inspecting the current code and choosing the structure that best fits it.

For now, bug editing is available in the current project workflow. Public/read-only access for people outside the project is a future feature and is not part of this task.

---

# Acceptance criteria

The feature is complete when:

1. The existing Bugs project-menu entry opens a working project bug list.
2. A new bug receives both its MongoDB/internal UID and an incrementing human bug number.
3. `CFilter` is used for the bug-list controls and supports the required filter/sort use cases.
4. Importance affects active bug list color, while Patched bugs are visually muted/grey.
5. Clicking a bug opens `/project/:tab/bugs/:bugId` using the internal bug UID.
6. Bug name and multiline description can be edited and persisted.
7. Creation date is automatic through the backend timestamp mechanism.
8. Importance and Difficulty use the new reusable RGT slider component.
9. Best resolve reacts to Importance/Difficulty according to a centralized calculation.
10. Status progression is shown with the new reusable RGT progress component.
11. Adding appropriate log types updates status automatically and records the log date/info.
12. Bug images can be added, displayed, zoomed, replaced, and deleted, with existing images handled through `CImage`.
13. `CSlider`, `CProgress`, and reusable `CFilter` extensions live in RGT rather than being implemented only for the bug page.
14. Existing pages/components continue working after shared RGT changes.
