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

> **Warning** New validators take effect the next time the control's value changes; they are not re-run when they are swapped. To re-validate straight away, patch the field with its current value right after the swap:
>
> ```ts
> validators$: accountType$.pipe(
>   map((type) => (type === 'business' ? [Validators.required] : [])),
>   tap(() => queueMicrotask(() =>
>     this.forms.patchValue({ account: { vatNumber: this.forms.formValue?.account?.vatNumber ?? null } })
>   ))
> ),
> ```
>
> If `validators` is also set, it wins and `validators$` is ignored.

## Cross-field rules

A validator receives the control, and `control.parent` is the group it lives in, so it can compare against siblings. See the password confirmation in the [sign-up tutorial](/tutorials/sign-up-form#comparing-two-fields).

## Server-side errors

The core package declares `NgsServerSideValidationErrorObjectType` for nested server errors, but nothing consumes it yet. Until then, map server errors to a custom validator or show them outside the form.
