# Values, state and submission

`NgsFormsService` is your handle on a form. This page covers everything it exposes.

::: demo form-state

## Reading the value

| Member | Type | Notes |
| --- | --- | --- |
| `formValue$` | `BehaviorSubject<any>` | Emits on every change. Nested under the root group name. |
| `formValue` | `any` | The latest value, for one-off reads. |
| `isValid` | `boolean` getter | `true` when every rendered control is valid. |
| `dirty` | `boolean` getter | `true` once the user has changed something. |

In components, turn the stream into a signal and derive everything else with `computed()`:

```ts
readonly value = toSignal(this.forms.formValue$, { initialValue: {} });
readonly greeting = computed(() => `Hello, ${this.value()?.profile?.name ?? 'stranger'}!`);
```

`isValid` and `dirty` are getters, not signals. In an `OnPush` or zoneless component, read them inside a `computed()` that also reads the value signal, so they are re-evaluated when the value changes:

```ts
readonly status = computed(() => {
  this.value();
  return { valid: this.forms.isValid, dirty: this.forms.dirty };
});
```

## Writing values

`patchValue()` sets values using the same shape as `formValue$`:

```ts
this.forms.patchValue({ profile: { title: 'Dr.', name: 'Ada Lovelace' } });
```

Only controls that exist receive values. See [Editing existing data](/tutorials/editing-data) for loading data into conditional fields and arrays.

## Submission

```ts
submit() {
  this.forms.setIsSubmitted(true);
  if (!this.forms.isValid) return;
  this.save(this.forms.formValue);
}
```

`setIsSubmitted(true)` shows every error message. The library does not render a submit button; use your own button, in or outside the form.

## Resetting

`setFormConfig()` always starts over: new controls, values back to their configured `value` (or empty), `submitted` back to `false`, and component state back to `globalState` and `initialState`. Keep the config in a method and call it again to reset:

```ts
reset() {
  this.forms.setFormConfig(this.buildConfig());
}
```

## Component state

Besides values, a form holds free-form state that components can read through `commonState()`. Set the starting state with `globalState` and `initialState` in the config, and change it later:

```ts
this.forms.updateGlobalState({ displayMode: 'summary' });            // every component
this.forms.updateComponentState('email', { showEditToggle: true });  // one component, by name or uuid
```

State merges: a component sees its own state first, then state for its `name`, then global state. The built-in components do not use state yet. It is there for your own controls. [Component state and edit toggle](/guides/component-state) walks through a summary mode with an edit toggle.

## Lifecycle

- The service lives as long as the component that provides it.
- `setFormConfig()` may be called before `<ngs-form>` renders; the call is retried for about half a second until the form connects. If `<ngs-form>` never appears, an error is logged.
