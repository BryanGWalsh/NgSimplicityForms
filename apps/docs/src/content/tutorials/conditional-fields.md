# Conditional fields

Most real forms ask follow-up questions: an email address only if the user wants email, a company name only for business accounts. In NG-Simplicity Forms any item can have a `visible$` stream. While it emits `false`, the item is not rendered, its control is removed from the form, and it does not count towards validation.

::: demo conditional-fields

## Derive streams from the form value

`NgsFormsService.formValue$` emits the whole form value on every change, nested under the root group's name. Map it to the value you care about and use `distinctUntilChanged()` so downstream streams only fire when that value actually changes.

```ts
const value$ = this.forms.formValue$.pipe(map((value) => value?.contact ?? {}));

const method$ = value$.pipe(
  map((v) => v.method),
  distinctUntilChanged()
);
```

> **Tip** Build these streams before calling `setFormConfig()` and reference them in the configuration. `formValue$` is a `BehaviorSubject`, so each item receives the current value as soon as it subscribes.

## Show a field for one answer

Give the item a `visible$` that emits `true` when it should be shown:

```ts
NgsFormsBootstrapRadioInputComponent.create({
  name: 'method',
  label: 'How should we reach you?',
  alignment: 'horizontal',
  options: [
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'none', label: "Don't contact me" },
  ],
}),
NgsFormsBootstrapFormItemInputComponent.create({
  name: 'email',
  label: 'Email address',
  validators: [Validators.required, Validators.email],
  visible$: method$.pipe(map((m) => m === 'email')),
}),
NgsFormsBootstrapFormItemInputComponent.create({
  name: 'phone',
  label: 'Phone number',
  validators: [Validators.required],
  visible$: method$.pipe(map((m) => m === 'phone')),
}),
```

Choose "Phone" in the demo and look at the value panel: `email` disappears and `phone` appears. Because hidden fields leave the form, the `required` validator on `email` does not block submission when the user picked phone.

## Hide a whole group

`visible$` works on every item, including containers. Wrap related fields in a form group (to nest their values) or a section (to keep them flat) and make the container conditional:

```ts
NgsFormsBootstrapFormsItemCheckboxComponent.create({ name: 'updates', label: 'Send me product updates' }),
NgsFormsFormGroupComponent.create({
  name: 'updatePreferences',
  visible$: value$.pipe(map((v) => !!v.updates), distinctUntilChanged()),
  items: [
    NgsFormsBootstrapFormItemSelectInputComponent.create({ name: 'frequency', label: 'How often?', options: [/* … */] }),
  ],
}),
```

## Things to know

- **Hidden means gone.** When an item is hidden its component is destroyed. Showing it again creates a fresh control, so the value the user typed earlier is not restored. If you need to keep it, store it yourself and `patchValue()` it back.
- **Items without `visible$` are always shown.** The static `visible` flag in the config types is reserved and not read yet.
- **Patching hidden fields does nothing.** Values can only be patched into controls that exist. See [Editing existing data](/tutorials/editing-data) for the pattern.
- **Any Observable works.** Visibility can come from anywhere: a feature flag service, the current user's role, a route parameter.

Next: [Repeating rows with form arrays](/tutorials/form-arrays).
