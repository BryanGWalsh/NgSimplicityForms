# Sign-up form with validation

In this tutorial you build a complete sign-up form: side by side name fields, an email, a password with a confirmation field, a select, a radio group and a terms checkbox. Along the way you will use built-in and custom validators, friendly error messages and the submitted state.

::: demo sign-up

Try submitting the empty form first: every required field shows its message at once. Then fill it in and watch the value panel update.

## The host component

Every form starts the same way: provide `NgsFormsService`, register the components, render `<ngs-form>`.

```ts title=sign-up.component.ts
@Component({
  selector: 'app-sign-up',
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button type="button" class="btn btn-primary" (click)="submit()">Create account</button>
  `,
})
export class SignUpComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.forms.setFormConfig({ inputUpdateDebounce: 0, globalState: {}, root: this.buildRoot() });
  }
}
```

## Two fields on one line

A row lays its items out side by side. `columnClass` applies one class to every item; use `columnClasses` to give each item its own.

```ts
NgsFormsRowComponent.create({
  containerClass: 'row g-3',
  columnClass: 'col-sm-6',
  items: [
    NgsFormsBootstrapFormItemInputComponent.create({
      name: 'firstName',
      label: 'First name',
      validators: [Validators.required],
      errorMessageMap: { required: 'First name is required.' },
    }),
    NgsFormsBootstrapFormItemInputComponent.create({
      name: 'lastName',
      label: 'Last name',
      validators: [Validators.required],
      errorMessageMap: { required: 'Last name is required.' },
    }),
  ],
}),
```

Rows only affect layout. Both values still land directly in the `signUp` group: `{ signUp: { firstName, lastName, … } }`.

## Built-in validators and messages

`validators` takes the same `ValidatorFn` array you would give a `FormControl`. `errorMessageMap` maps each error key to the text the user sees. Only the first error is shown, so list the most important validator first.

```ts
NgsFormsBootstrapFormItemInputComponent.create({
  name: 'email',
  label: 'Work email',
  type: 'email',
  validators: [Validators.required, Validators.email],
  errorMessageMap: { required: 'Email is required.', email: 'Enter a valid email address.' },
}),
```

The error keys are the ones Angular uses: `required`, `email`, `minlength`, `maxlength`, `min`, `max` and `pattern`. `Validators.requiredTrue` reports `required`.

## Custom validators

A custom validator is a normal Angular `ValidatorFn`. Whatever key it returns is the key you put in `errorMessageMap`.

```ts
/** At least one digit and one letter. */
const strongPassword: ValidatorFn = (control) =>
  !control.value || (/\d/.test(control.value) && /[a-z]/i.test(control.value)) ? null : { weak: true };
```

### Comparing two fields

Every field is a control inside its parent group, so a validator can reach a sibling through `control.parent`:

```ts
function matches(otherName: string): ValidatorFn {
  return (control) => {
    const other = control.parent?.get(otherName);
    return !other || other.value === control.value ? null : { mismatch: true };
  };
}

NgsFormsBootstrapFormItemInputComponent.create({
  name: 'confirmPassword',
  label: 'Confirm password',
  type: 'password',
  validators: [Validators.required, matches('password')],
  errorMessageMap: { required: 'Repeat your password.', mismatch: 'Passwords do not match.' },
}),
```

> **Note** Angular re-runs a control's validators when that control changes. If the user edits `password` after `confirmPassword`, the mismatch is re-checked the next time `confirmPassword` changes.

## Selects, radios and checkboxes

Option based inputs take an `options` array of `{ id, label, disabled? }`. The `id` is what ends up in the form value.

```ts
NgsFormsBootstrapFormItemSelectInputComponent.create({
  name: 'teamSize',
  label: 'Team size',
  labelLocation: 'top',
  placeholder: 'Select…',
  options: [
    { id: '1', label: 'Just me' },
    { id: '2-10', label: '2 to 10' },
  ],
  validators: [Validators.required],
}),
NgsFormsBootstrapRadioInputComponent.create({
  name: 'plan',
  label: 'Plan',
  alignment: 'horizontal',
  options: [
    { id: 'free', label: 'Free' },
    { id: 'pro', label: 'Pro' },
    { id: 'enterprise', label: 'Enterprise', disabled: true },
  ],
}),
NgsFormsBootstrapFormsItemCheckboxComponent.create({
  name: 'acceptTerms',
  label: 'I accept the terms of service',
  validators: [Validators.requiredTrue],
  errorMessageMap: { required: 'You need to accept the terms.' },
}),
```

## Submitting

Errors normally appear once a field is touched or changed. When the user presses submit you want to show all of them, which is what `setIsSubmitted(true)` does.

```ts
submit() {
  this.forms.setIsSubmitted(true);
  if (!this.forms.isValid) return;
  this.api.createAccount(this.forms.formValue.signUp).subscribe();
}
```

## Resetting

Calling `setFormConfig()` again rebuilds the form from scratch: new controls, empty values and the submitted flag cleared.

```ts
reset() {
  this.forms.setFormConfig({ inputUpdateDebounce: 0, globalState: {}, root: this.buildRoot() });
}
```

## What you learned

- Rows lay fields out without changing the value shape.
- `validators` and `errorMessageMap` cover built-in and custom rules, including cross-field checks.
- `setIsSubmitted(true)` reveals every error; `isValid` and `formValue` give you the result.

Next, make parts of the form appear only when they are relevant in [Conditional fields](/tutorials/conditional-fields).
