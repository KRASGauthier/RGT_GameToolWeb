# Profile / User Management — Recap

**Date:** 2026-08-28  
**Scope:** profile UI, shared RGT user API/backend, validation, password and avatar handling.

## To do
- [ ] Remove explicit **Edit Profile** mode; fields stay editable.
- [ ] Track edits with `Partial<...>`; show **Save / Cancel** only when dirty.
- [ ] **Important:** inspect `CForm` before duplicating reusable dirty/change tracking.
- [ ] Move user/profile HTTP calls into `frontend/rgt/api/user/`.
- [ ] Remove the separate backend `profile` API/module; use existing RGT `users`.
- [ ] Move `patchUserSelf` to the user controller/router behind `verifyJWT`.
- [ ] Define API payload types + runtime `checkApi` checkers.
- [ ] Remove manual `.trim()` for normal user fields; Mongoose already handles it.
- [ ] Implement **Change Password** with `CForm` + backend `checkPassword`/Argon2.
- [ ] Use `appTheme` / component styling instead of MUI design values.
- [ ] Add avatar editing using existing UI + Multer + Sharp; store square avatars.
- [ ] **Never install a dependency without asking first.**

---

## 1. Profile editing
No separate edit state. Keep only values that differ from the saved user:

```ts
type TProfileChanges = Partial<
	Pick<IUserFull, "firstName" | "lastName" | "username" | "email">
>;

const [changes, setChanges] = useState<TProfileChanges>({});
const hasChanges: boolean = Object.keys(changes).length > 0;
```

Changed value → add/update key. Restored value → remove key. Empty object → hide Save/Cancel. Cancel → clear. Save → PATCH `changes`, update local user, clear.

Use existing variants such as `styling="cancel"` instead of manually setting button colors.

### Important: `CForm`
`CForm` already keeps a `valueObject`. Check whether reusable support for **initial values, dirty state, reset and changed-only output** should live there before creating another generic mechanism.

---

## 2. Architecture
Profile is a **frontend concept**; persistent profile data is **user management**.

```text
PProfile → frontend/rgt/api/user/ → /API/users/self
         → verifyJWT → backend/rgt/modules/users/
```

Keep the frontend `/profile` page/route. Remove:
- `backend/rgt/modules/profile/`
- `API_PROFILE`
- `profileRouter`
- its backend `app.use(...)` registration.

Use the existing user routes:

```ts
userRouter.get(API_USER_SELF, verifyJWT, getUserSelfFull);
userRouter.patch(API_USER_SELF, verifyJWT, patchUserSelf);
```

Shared endpoint constants belong in RGT constants, never hardcoded in `index` or stored in project-specific constants.

---

## 3. API types + `checkApi`
Do not keep API payload shapes inline, e.g.:

```ts
{ firstName: string; lastName: string; username: string }
```

Define them in RGT API types:

```ts
export type IAPIUserPatchSelf = Partial<
	Pick<IUserFull, "firstName" | "lastName" | "username" | "email">
>;
```

Example fixed contract + checker:

```ts
export interface IAPIUserIdentity {
	firstName: string;
	lastName: string;
	username: string;
}

export const API_USER_IDENTITY_CHECKER: TAPIChecker = {
	firstName: { type: "string" },
	lastName: { type: "string" },
	username: { type: "string" },
};
```

`checkApi<T>(data, checker)` validates incoming HTTP data **at runtime**, then returns it typed as `T`:

```ts
const data: IAPIUserIdentity = checkApi<IAPIUserIdentity>(
	req.body,
	API_USER_IDENTITY_CHECKER,
);
```

`req.body as IAPIUserIdentity` does not validate anything at runtime.

### Current PATCH limitation
Current `checkApi`:
1. requires every checker key;
2. does **not** reject unexpected keys.

A PATCH needs optional fields and a whitelist. Recommended checker capability:

```ts
export interface IAPICheckInfo {
	type: TTypeOf | "checker";
	checker?: TAPIChecker;
	optional?: boolean;
}

export const API_USER_PATCH_SELF_CHECKER: TAPIChecker = {
	firstName: { type: "string", optional: true },
	lastName: { type: "string", optional: true },
	username: { type: "string", optional: true },
	email: { type: "string", optional: true },
};
```

`checkApiSub` should skip missing optional fields and reject any input key absent from the checker. Until that exists, do **not** send unrestricted `req.body` directly to MongoDB; whitelist allowed fields.

---

## 4. Backend update
Manual `.trim()` is unnecessary for normal user fields. The Mongoose schema already has `trim: true` on `username`, `email`, `firstName` and `lastName`; email also has `lowercase: true`.

Once `checkApi` safely handles the PATCH contract:

```ts
const update: IAPIUserPatchSelf = checkApi<IAPIUserPatchSelf>(
	req.body,
	API_USER_PATCH_SELF_CHECKER,
);

const updatedUser = await User.findByIdAndUpdate(req.user, update, {
	new: true,
	runValidators: true,
});
```

Keep `runValidators: true` so schema validation runs on updates.

### Password is separate
Do not include `password` in the generic profile PATCH. Password changes must use existing backend `checkPassword(...)` and Argon2 hashing.

Frontend: use `CForm`; `CFormPassword` already validates format and `CFormPasswordConfirm` handles matching. Backend validation is still mandatory.

---

## 5. `verifyJWT`
`verifyJWT` does more than set `req.user`: it validates the access token and blocks unauthorized requests. Any private endpoint must use it even if its controller does not otherwise need `req.user`.

The current profile route already does this correctly.

---

## 6. Styling
- Never use MUI palette values such as `"primary.main"` / `"error.main"` for app styling.
- Prefer `appTheme` for colors, structural spacing/padding, fonts and animations.
- Prefer component `styling`, `size` and weight props.
- Profile fields should use softer `neutral` styling rather than looking disabled.
- Use `CTitle` / `CText`, not raw `h1`–`h6`.
- Keep values lowercase/camelCase (`"security"`); presentation can use `textTransform: "capitalize"`.
- Small local gaps are fine; major layout spacing should preferably come from `appTheme`.

---

## 7. Avatar
Reserve the left side of the profile for avatar editing and the right side for user information.

Reuse existing image/avatar infrastructure. This ZIP contains:

```text
frontend/rgt/components/images/CImage.tsx
frontend/rgt/components/feedback/dialogs/CDialogImage.tsx
```

The conversation also referenced `CAvatar`; if it exists in the latest synchronized RGT, reuse it rather than recreating it.

Backend flow:

```text
Avatar UI → User API → verifyJWT → uploadImage/Multer
          → req.file → Sharp → square avatar → user.avatar
```

Use existing `uploadImage` from `backend/rgt/middleware/upload.ts`. It writes to `BACKEND_UPLOADE_LOCATION`; keep that temporary behavior for now.

Multer stores the file on disk and exposes it through `req.file`; it does **not** automatically store image bytes in MongoDB.

`sharp` is already installed. Use it to crop/resize to square:

```ts
await sharp(req.file.path)
	.rotate()
	.resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
	.toFile(finalPath);
```

---

## 8. Dependency rule
**Ask before installing any npm package.** Check whether an existing dependency solves the problem and review adoption, dependents, repository activity/reputation and maintenance/security quality.

No new package is required:

```text
multer → uploads
sharp  → crop / resize
```

---

## Final rule
**Profile stays a UI/page concept. Reusable profile data and behavior belong to the shared RGT `user` domain: API types, runtime validation, protected routes, controllers, password handling and avatar management.**
