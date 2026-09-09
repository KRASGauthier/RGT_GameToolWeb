# Changes to Finish — 2026-09-02

This recap contains only the small set of changes discussed today after deciding to redo the recap from the updated `audit.zip`.

The updated audit was checked before writing this file. The relevant current files are:

- `frontend/rgt/pages/PAuth/PAuth.tsx`
- `frontend/rgt/components/inputs/form/CForm.tsx`
- `frontend/rgt/components/inputs/form/CFormComponent.tsx`
- `frontend/src/pages/PProfile/components/PProfileInformation.tsx`
- `frontend/src/pages/PProfile/components/PProfileContact.tsx`
- `frontend/rgt/api/user/userAPI.ts`
- `backend/rgt/modules/users/controller.ts`
- `backend/rgt/middleware/upload.ts`
- `backend/rgt/consts.ts`

---

## 1. Replace the profile information/contact fields with `CForm`

### Current state

`PProfileInformation` and `PProfileContact` still manually manage:

- `CTextFieldOutlined`
- local `changes` objects
- Save / Cancel buttons
- field changes and resets
- direct calls to `apiUserPatchSelf`

This duplicates functionality that now already exists in `CForm`.

`CForm` already supports managed/edit mode through `values`:

- `values` contains the saved values;
- `valueObject` contains edits;
- `currentValues` merges saved values with edits;
- Save / Cancel buttons appear in managed mode;
- Cancel clears the local edits and therefore restores the values coming from `values`;
- `onSendEdit` is called when the managed form is submitted;
- field validation is handled by the relevant `CForm` subcomponent.

### Target

Use `CForm` directly in both profile sections.

`PProfileInformation` should use one managed `CForm` for:

1. first name;
2. last name;
3. username.

`PProfileContact` should use one managed `CForm` for:

1. email.

The profile pages should keep responsibility for:

- loading the current user;
- calling the API when `CForm` submits an edit;
- updating the local `user` after a successful response;
- showing the success notification.

The field validation, edit tracking, reset behavior and form buttons should be handled by `CForm` instead of being recreated in the profile pages.

---

## 2. Reuse the registration field configuration from `PAuth`

`PAuth` is the reference for the profile fields because it already contains the intended validation rules.

### First name

Reuse the same entry configuration:

```ts
{
    type: "text",
    label: "First name",
    filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
    max: 100,
    field: "firstName",
    required: true,
}
```

This keeps the same Unicode-aware name filter already used during registration and the same maximum length.

### Last name

Reuse the same entry configuration:

```ts
{
    type: "text",
    label: "Last name",
    filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
    max: 100,
    field: "lastName",
    required: true,
}
```

This gives profile editing the same behavior as registration instead of allowing values that the registration form would reject.

### Username

Reuse the same username configuration:

```ts
{
    type: "user",
    multiLang: true,
    max: AUTH_MAX_USER,
    min: AUTH_MIN_USER,
    field: "username",
    required: true,
}
```

`CFormUser` already provides the username-character filtering. The `multiLang` flag selects the multilingual username rule, while `min` and `max` keep the same length restrictions as registration.

### Email

`PProfileContact` should use a normal `email` entry:

```ts
{
    type: "email",
    field: "email",
    required: true,
}
```

`CFormEmail` already supplies its local email-format validation, so the profile page does not need to recreate the regex.

---

## 3. Reuse the username availability check from `PAuth`

`PAuth` currently uses:

```ts
const handleUserCheck = async (username: string): Promise<boolean> => {
    return await apiUserCheckAvailable(username, push);
};
```

and passes it to:

```tsx
<CForm onUsernameCheck={handleUserCheck} ... />
```

The same mechanism should be used by `PProfileInformation`.

### Important profile-specific case

The current username already belongs to the logged-in user. If the user edits the field and returns to their existing username, the generic `/available` endpoint will find that username in MongoDB and report it as unavailable.

The profile handler therefore needs to treat the currently saved username as valid before calling the availability API.

Conceptually:

```ts
if (username == user.username)
    return true;

return await apiUserCheckAvailable(username, push);
```

The first branch means "this is still my own saved username, so do not reject it as already taken." Only genuinely different usernames need the backend availability request.

`CFormComponent` already handles the rest of the availability flow:

- debounce;
- `Checking availability...` state;
- available styling/message;
- invalidating the field when the username is unavailable.

The profile page should not reproduce that logic.

---

## 4. Use `CForm` managed mode for profile updates

For profile editing, pass the saved user values through `values`.

For the information form, the values object should contain only the fields handled by that form:

```ts
{
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    username: user.username,
}
```

For the contact form:

```ts
{
    email: user.email,
}
```

Keeping only the fields owned by that form avoids accidentally submitting unrelated user properties.

### `onSendEdit`

The profile submit handler should:

1. call `apiUserPatchSelf` with the data provided by `CForm`;
2. return `false` if the request fails;
3. update the local `user` when the backend returns the updated user;
4. show the success notification;
5. return `true`.

Returning `true` matters because the current `CForm` implementation clears `valueObject` only when `onSendEdit` resolves to `true`. That is what hides the managed Save / Cancel buttons after a successful save.

### One `CForm` managed-mode correction to make before relying on it fully

The current `handleOnChange` always stores the edited field in `valueObject`:

```ts
copy[field] = value;
```

That means if a user changes a value and then manually changes it back to its original saved value, the field still remains inside `valueObject`, so the form still considers itself edited and continues showing Save / Cancel.

In managed mode, compare the incoming value with `values[field]`:

- if it is different, keep it in `valueObject`;
- if it matches the saved value again, remove that field from `valueObject`.

This restores the intended dirty-state behavior: no actual difference means no edit buttons.

For primitive profile fields (`string`), direct equality is sufficient. `IVersion` would need value comparison rather than object-reference comparison if the same logic is generalized to version fields.

---

## 5. Avatar: save into the dedicated `avatar` folder

### Current state

`uploadImage` currently writes the temporary Multer upload directly into:

```text
BACKEND_UPLOADE_LOCATION
```

That temporary behavior can stay.

`patchUserSelfAvatar` then processes the temporary file with Sharp and currently calculates a final subdirectory using `STATIC_AVATARS`, but it never creates that directory before calling `.toFile(finalPath)`.

### Target final location

The processed avatar must be stored under:

```text
BACKEND_UPLOADE_LOCATION/avatar/
```

For development, with the current fallback, that means:

```text
/home/app/uploaded-dev/avatar/
```

### Create the directory before saving

Before calling Sharp `.toFile(finalPath)`, create the avatar directory recursively.

The relevant Node API is:

```ts
await fs.mkdir(uploadLocation, { recursive: true });
```

`recursive: true` means the call succeeds both when the directory needs to be created and when it already exists. This avoids having to perform a separate existence check first.

### Normalize the avatar directory constant/path

The updated audit currently has:

```ts
export const STATIC_AVATARS = "/avatars";
```

and then builds the disk path with:

```ts
`${BACKEND_UPLOADE_LOCATION}/${STATIC_AVATARS}`
```

The requested final folder is `avatar`, and the current constant also contains a leading `/`, which makes path composition unnecessarily fragile.

Use one consistent directory segment for the filesystem and generated public URL. Prefer composing filesystem paths with `path.join(...)` rather than manually concatenating slashes.

The public URL must remain consistent with the directory exposed by:

```ts
app.use(STATIC_IMAGES, express.static(BACKEND_UPLOADE_LOCATION));
```

so an avatar stored at:

```text
uploaded-dev/avatar/<filename>
```

should resolve through an image URL equivalent to:

```text
/images/avatar/<filename>
```

---

## 6. Avatar: safely replace the previous image

### Required order

The new avatar must be successfully processed and saved before the previous avatar file is removed.

A safe flow is:

1. validate `req.user` and `req.file`;
2. load the current user so the old `avatar` URL/path is known;
3. create `uploaded-dev/avatar/` if necessary;
4. process the uploaded temporary image with Sharp;
5. successfully save the new processed avatar;
6. update the user's `avatar` field to the new URL;
7. only after the new avatar is successfully usable, remove the old local avatar if one exists;
8. remove the temporary Multer file;
9. return the updated user.

The main rule is that failure while creating the new avatar must never destroy the previous working avatar.

### Important issue in the current code: the filename is not unique

The current code always uses:

```ts
const fileName = `avatar-${req.user}-512.png`;
```

Therefore the previous avatar and the new avatar use the exact same final path.

If the function follows the requested order literally:

1. save the new image;
2. delete the old image;

then step 2 would delete the file that was just created, because the "old" and "new" paths are identical.

The replacement therefore needs a different final filename for each uploaded avatar.

A simple source already exists: Multer generates a UUID filename for every temporary upload. The processed avatar filename can reuse that unique identifier while still producing a PNG. This avoids introducing another ID-generation mechanism in the controller.

For example, conceptually:

```text
avatar-<user id>-<upload uuid>.png
```

Now the old and new files have different paths, so the old file can safely be deleted after the new one succeeds.

### Deleting the previous file

The user's stored `avatar` value is a public URL, not directly a filesystem path.

Do not blindly pass the entire URL to `fs.unlink`.

Instead:

1. make sure the old avatar points to an application-owned local avatar path;
2. obtain the filename from that URL;
3. build the actual disk path inside the avatar directory with `path.join`;
4. check/delete that file;
5. ignore the "file does not exist" case, because the requirement is only to remove it if it still exists.

Using only the filename and the known avatar directory also prevents the stored URL from being interpreted as an arbitrary filesystem path.

### Failure behavior

Deletion of the previous avatar should happen only after the new image has been saved successfully. Prefer keeping the new avatar active even if cleanup of an already-missing old file is unnecessary.

If updating the user in MongoDB fails after creating the new processed file, clean up the new file so it does not remain orphaned.

---

## 7. Final checklist

1. Replace the manual first-name, last-name and username fields in `PProfileInformation` with managed `CForm` entries.
2. Copy the first-name and last-name filter/max rules from `PAuth`.
3. Copy the username type, multilingual setting, min and max rules from `PAuth`.
4. Pass `onUsernameCheck` to the profile information form.
5. Treat the user's current username as valid without asking `/available` to validate it against itself.
6. Replace the manual email field in `PProfileContact` with a managed `CForm` email entry.
7. Use `onSendEdit` to call `apiUserPatchSelf`, update the local user and return success/failure to `CForm`.
8. Fix managed `CForm` dirty tracking so restoring the original value removes the field from `valueObject`.
9. Create `BACKEND_UPLOADE_LOCATION/avatar/` before Sharp writes the processed avatar.
10. Keep the temporary Multer upload in the existing upload root; only the processed final avatar belongs in `avatar/`.
11. Give each final avatar a unique filename so old/new files are different.
12. Save the new avatar successfully before removing the previous avatar.
13. Delete the previous avatar only when it belongs to the local avatar directory and still exists.
14. Keep the stored public avatar URL consistent with the static `/images` route and the `avatar` directory.
15. Clean up temporary/new files appropriately when later operations fail.
