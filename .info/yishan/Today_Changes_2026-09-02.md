# Changes to Do — 2026-09-02

This recap is based on the updated `audit(1).zip` code and only covers the changes discussed today.

## 1. Profile — Move information/contact editing to `CForm`

Replace the manual profile fields and manual edit tracking in:

- `frontend/src/pages/PProfile/components/PProfileInformation.tsx`
- `frontend/src/pages/PProfile/components/PProfileContact.tsx`

with the shared `CForm`.

Use `frontend/rgt/pages/PAuth/PAuth.tsx` as the reference for the field definitions and validation behavior.

### Information form

Recover the same behavior already used by the registration form in `PAuth`:

- **First name**
  - `type: "text"`
  - field: `firstName`
  - required
  - max: `100`
  - use the same Unicode name filter from `PAuth`

- **Last name**
  - `type: "text"`
  - field: `lastName`
  - required
  - max: `100`
  - use the same Unicode name filter from `PAuth`

- **Username**
  - `type: "user"`
  - field: `username`
  - required
  - `multiLang: true`
  - min: `AUTH_MIN_USER`
  - max: `AUTH_MAX_USER`
  - use `onUsernameCheck` with the existing username availability API

The reference flow already exists in `PAuth`:

```ts
const handleUserCheck = async (username: string): Promise<boolean> => {
	return await apiUserCheckAvailable(username, push);
};
```

Use `CForm` managed/edit mode with the loaded user values so that `CForm` handles validation, changed values, Save/Cancel behavior, and submission through `apiUserPatchSelf`.

### Contact form

Replace the manual email `CTextFieldOutlined` with `CForm` using an `email` entry and the current saved email as the managed value.

Submit the edit through `apiUserPatchSelf` the same way as the information form.

---

## 2. Backend — Save avatars inside the avatar directory

Update `patchUserSelfAvatar` in:

`backend/rgt/modules/users/controller.ts`

The controller already builds a dedicated avatar upload path, but it does **not** currently make sure that directory exists before calling `sharp(...).toFile(...)`.

Before saving the processed avatar:

1. Build the avatar directory from `BACKEND_UPLOADE_LOCATION` and the avatar static path.
2. Check/create the avatar directory when necessary.
3. Use recursive directory creation so the operation is safe when the folder already exists.
4. Only then write the processed avatar into that directory.

The uploaded temporary file can still be removed after Sharp successfully creates the processed image.

---

## 3. Backend — Remove the previous avatar when it is replaced

`patchUserSelfAvatar` currently writes the new avatar and updates `user.avatar`, but it never removes the user's previous avatar file.

Update the same function so that:

1. The current user is loaded so the previous `avatar` value is known.
2. The new avatar is successfully processed and saved first.
3. If the user already had an avatar, resolve its local file path.
4. If that previous file still exists, delete it.
5. Do not delete the newly-created file if the old and new paths are the same.
6. Update/return the user with the new avatar URL.

The important rule is: **do not remove the previous avatar until the replacement image has been successfully saved.**
