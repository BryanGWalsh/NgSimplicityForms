# Component state and edit toggle

Besides its values, a form holds **state**: small, free-form flags that tell components how to render. The main use is a compact summary mode with an edit toggle. On a phone, each field shows a single line with its current value, and the user taps **Edit** to open the real control. That saves space when most answers are already filled in.

::: demo component-state

## Where state comes from

State has three layers. A component sees the first one that sets a key:

1. **Its own state**, keyed by the item's `uuid`. Comes from the item's `initialState` or from `toggleDisplayMode()`.
2. **State by `name`**, from the form's `initialState` or `updateComponentState(name, …)`.
3. **Global state**, from the form's `globalState` or `updateGlobalState(…)`.

### In the configuration

```ts
this.forms.setFormConfig({
  inputUpdateDebounce: 0,
  // Every component
  globalState: { displayMode: 'summary', showEditToggle: true },
  // Components by name or uuid
  initialState: { notes: { showEditToggle: false } },
  root: NgsFormsFormGroupComponent.create({
    name: 'delivery',
    items: [
      CompactFieldComponent.create({
        name: 'address',
        label: 'Address',
        // This item only
        initialState: { displayMode: 'input' },
      }),
    ],
  }),
});
```

`globalState` and the form's `initialState` are applied each time `setFormConfig()` is called, so a new config starts from a clean state. An item's `initialState` is applied when its component is first created. It is not re-applied when a `visible$` item is shown again, so the mode the user picked is kept.

### At runtime

```ts
this.forms.updateGlobalState({ displayMode: 'input' });               // every component
this.forms.updateComponentState('address', { displayMode: 'summary' }); // one component, by name or uuid
```

Updates merge into what is already there. A key set on a lower layer still wins, so `updateGlobalState()` does not override a component whose own state sets the same key.

## The common keys

| Key | Values | Meaning |
| --- | --- | --- |
| `displayMode` | `'input'` (default), `'summary'` | Show the editable control, or a compact read-only line with the current value. |
| `showEditToggle` | `boolean` | Show a button that switches between the two modes. |

You can add your own keys too. `commonState()` returns whatever has been set.

> **Note** The built-in Bootstrap, Material and Tailwind components do not read `displayMode` or `showEditToggle` yet. To use summary mode today, build the control yourself, as shown below.

## Building a control with a summary mode

Extend one of the input base classes (see [Building a custom control](/tutorials/custom-control)), then read `commonState()` in the template and call `toggleDisplayMode()` from the toggle:

```html
@if (commonState().displayMode === 'summary') {
  <div class="row">
    <span>{{ config.label }}</span>
    <strong>{{ control.value || 'Not set' }}</strong>
    @if (commonState().showEditToggle) {
      <button type="button" (click)="toggleDisplayMode('input')">Edit</button>
    }
  </div>
} @else {
  <label [for]="id">{{ config.label }}</label>
  <input [id]="id" [formControl]="control" />
  @if (commonState().showEditToggle) {
    <button type="button" (click)="toggleDisplayMode('summary')">Done</button>
  }
}
```

`toggleDisplayMode('input' | 'summary')` sets `displayMode` in the component's own state. Called with no argument, it flips the current mode. Because it writes the component's own state, it only affects that one field.

## Things to know

- **The control stays in the form in both modes.** Summary mode only changes what is rendered, so the value is still in `formValue$` and is still validated. Show `errorMessage` in summary mode too, or the user cannot see why the form is invalid.
- **State is per form.** Each `NgsFormsService` has its own state, and `setFormConfig()` resets it.
- **`commonState()` is a signal.** It works in `OnPush` and zoneless components without extra change detection calls.
