# Signals, OnPush and zoneless

The library is written for modern Angular change detection. Every component uses `ChangeDetectionStrategy.OnPush`, form state is turned into signals with `toSignal()`, and nothing relies on zone.js to notice changes. This documentation site runs with `provideZonelessChangeDetection()`, so every demo on it doubles as a zoneless test.

## Zoneless applications

Nothing extra is needed:

```ts title=app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection()],
};
```

Inside the library:

- Inputs bind with `[formControl]`, whose DOM events schedule change detection on their own.
- Components subscribe to value, status and submit changes and call `markForCheck()` when an error message changes.
- Visibility, options and component state are exposed as signals or updated with `markForCheck()`.

## Writing your host component

Follow the same rules in the component that hosts the form:

- Read form data through signals (`toSignal(this.forms.formValue$)`), not by subscribing and assigning fields.
- Wrap `isValid` and `dirty`, which are plain getters, in a `computed()` that also reads a signal that changes with the form (see [Values, state and submission](/guides/form-state#reading-the-value)).
- Keep your own UI state (submitted, loading, messages) in signals.

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgsFormsService],
  template: `
    <ngs-form></ngs-form>
    <button [disabled]="!status().valid" (click)="save()">Save</button>
  `,
})
export class EditProfileComponent {
  private readonly forms = inject(NgsFormsService);
  private readonly value = toSignal(this.forms.formValue$);
  readonly status = computed(() => {
    this.value(); // re-evaluate whenever the value changes
    return { valid: this.forms.isValid };
  });
}
```

## Applications that still use zone.js

Everything works the same with zone.js; you simply get extra change detection runs. You do not need to change anything when you migrate to zoneless later.

## Custom components

If you build your own controls, keep them `OnPush` and either bind the control with `[formControl]` or call `markForCheck()` when you change what the template shows. The base class already marks the view for check when `errorMessage` changes.
