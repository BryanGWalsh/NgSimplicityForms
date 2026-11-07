# Validation and errors

Validation uses Angular's own `ValidatorFn`s. The engine adds three things on top: per-error messages, a submitted state that reveals every error, and validators that can change while the form is in use.

::: demo validation

## Validators

Pass an array of validators, exactly as you would to a `FormControl`:

```ts
NgsFormsBootstrapFormItemInputComponent.create({
  name: 'handle',
  label: 'Handle',
  validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9_]*$/i), notReserved],
}),
```

Groups and arrays accept `validators` too, for rules about the group as a whole.

## Error messages

`errorMessageMap` maps an error key to a message:

```ts
errorMessageMap: {
  required: 'Pick a handle.',
  minlength: 'At least 3 characters.',
  pattern: 'Letters, numbers and underscores only.',
  reserved: 'That handle is reserved.', // from the custom validator
},
```

How messages are chosen:

- Only the **first** error on the control is shown, in the order Angular reports them (the order of your `validators` array).
- An error with no entry in the map falls back to `Field is invalid: <key>`, as the Age field in the demo shows.
- The message is exposed to the component as `errorMessage`; the Bootstrap components render it under the field and set `aria-describedby`, and the Material components render it in `mat-error`.

## When errors appear

An error message is shown when the control is invalid **and** at least one of these is true:

- the user has touched the field (focused and left it),
- the user has changed its value (dirty),
- the form has been marked submitted with `setIsSubmitted(true)`.

```ts
submit() {
  this.forms.setIsSubmitted(true);  // reveal everything
  if (this.forms.isValid) { /* … */ }
}
```

Call `setIsSubmitted(false)` to hide untouched errors again, for example after a successful save. `setFormConfig()` also resets it.

## Hidden fields are not validated

Items hidden with `visible$` are removed from the form, so their validators do not count. A `required` field that only appears for business accounts never blocks personal accounts. See [Conditional fields](/tutorials/conditional-fields).

## Changing validators at runtime

`validators$` takes a stream of validator arrays. Each emission replaces the control's validators:

```ts
const accountType$ = this.forms.formValue$.pipe(map((v) => v?.account?.type), distinctUntilChanged());

NgsFormsBootstrapFormItemInputComponent.create({
  name: 'vatNumber',
  label: 'VAT number',
  validators$: accountType$.pipe(
    map((type) => (type === 'business' ? [Validators.required] : []))
  ),
  errorMessageMap: { required: 'Business accounts need a VAT number.' },
}),
```

The control is re-validated on each emission, so the new rules apply straight away. (Before 1.1.4 they only applied on the next value change.)

If `validators` is also set, it wins and `validators$` is ignored.

## Cross-field rules

A validator receives the control, and `control.parent` is the group it lives in, so it can compare against siblings. See the password confirmation in the [sign-up tutorial](/tutorials/sign-up-form#comparing-two-fields).

## Server-side errors

When the server rejects a submission, pass its errors to `NgsFormsService.setServerErrorMessages()`. The object has the same shape as the form value, including the root group name, and each leaf is an error key. The key is looked up in that field's `errorMessageMap`, just like a client-side validator's key:

```ts
NgsFormsBootstrapFormItemInputComponent.create({
  name: 'userName',
  label: 'User name',
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Pick a user name.',
    taken: 'User Name Not Available',
  },
}),

// Later, when the server answers:
this.forms.setServerErrorMessages({ registration: { userName: 'taken' } });
```

Form array rows are matched by index. Use `{}` (or `null`) for rows without errors, so this marks only the third row's phone:

```ts
this.forms.setServerErrorMessages({
  registration: { contacts: [{}, {}, { phone: 'invalidPhone' }, {}] },
});
```

A leaf can also be an array of keys, and a key can be set on a group or array as well as on an input.

How server errors behave:

- **They show at once.** The control is marked as touched, so the message appears without waiting for the user.
- **They clear when the field changes.** Each error stays until that control's value changes, even when other validation runs in between. Changing the value back does not bring it back.
- **Unknown keys show as text.** A key with no entry in `errorMessageMap` is shown as the message itself, so the server can send ready-made text such as `'That name is reserved'`.
- **Unmatched paths are returned.** `setServerErrorMessages()` returns the paths that matched no rendered control, for example a hidden field or a missing array row, so you can show those errors elsewhere.
- **They are cleared all at once** by the next `setServerErrorMessages()` call, by `clearServerErrorMessages()`, by `setFormConfig()`, and when a form array row is added or removed (rows are matched by index, so an error could otherwise land on the wrong row).

Server errors are for fields. Show errors that belong to the whole form, such as "The service is unavailable", outside the form.

Server errors make the form invalid like any other error. Read `control.errors[key].ngsServerError` (`NGS_FORMS_SERVER_ERROR`) in a custom component to tell them apart.

### Building the object from a list of paths

Many APIs return errors as a flat list. `constructServerErrorMessageObject()` turns a list of `{ jsonPath, validator }` pairs into the object above:

```ts
import { constructServerErrorMessageObject } from '@ng-simplicity/forms-core';

const errors = constructServerErrorMessageObject([
  { jsonPath: 'registration.userName', validator: 'taken' },
  { jsonPath: 'registration.contacts[2].phone', validator: 'invalidPhone' },
]);
// { registration: { userName: 'taken', contacts: [{}, {}, { phone: 'invalidPhone' }] } }

this.forms.setServerErrorMessages(errors);
```

Paths use dots for groups and `[n]` for array rows. A leading `$` or `$.` is ignored, and keys with spaces can be written as `['user name']`. Other JSONPath features, such as wildcards and filters, are not supported. Two errors on the same path become an array of keys.

`setServerErrorMessages()`, `clearServerErrorMessages()` and `constructServerErrorMessageObject()` are not available in version `1.1.4` and earlier.
