# Core concepts

This page explains the moving parts of the engine: the form configuration, form items, the component registry, and how a configuration turns into a rendered Angular reactive form.

## The form configuration

`NgsFormsService.setFormConfig()` takes an `NgsFormsFormConfig`:

```ts
interface NgsFormsFormConfig {
  root: NgsFormsFormItem<any>;          // the top of the tree, usually a form group
  globalState: NgsFormsGlobalFormState; // initial state shared by every component
  inputUpdateDebounce: number;          // reserved, see "Status and limitations"
  initialState?: any;                   // reserved
}
```

The root is almost always an `NgsFormsFormGroupComponent`. Its `name` becomes the top level key of the form value, so a root named `profile` produces `{ profile: { … } }`.

## Form items

Every node in the tree is an `NgsFormsFormItem`:

```ts
interface NgsFormsFormItem<T> {
  uuid?: string; // unique id, generated for you
  type: string;  // registry key of the component that renders it
  config: T;     // that component's configuration
}
```

You rarely write these objects by hand. Each component has a static `create(config)` helper that fills in `type` and `uuid` and gives you type checking on `config`:

```ts
NgsFormsBootstrapFormItemInputComponent.create({ name: 'email', label: 'Email' });
// → { uuid: '3f2c…', type: 'input-text', config: { name: 'email', label: 'Email' } }
```

### Kinds of items

| Kind | Examples | Creates a control? | Effect on the value |
| --- | --- | --- | --- |
| Inputs | `input-text`, `select`, `checkbox`, custom controls | `FormControl` | Adds `name: value` to the parent group. |
| Groups | `form-group` | `FormGroup` | Nests its children under `name`. |
| Arrays | `form-array` | `FormArray` | Adds `name: [ … ]` with one object per row. |
| Layout | `section`, `form-row`, `column` | No | None; children join the nearest group. |
| Content | `text-div`, `content-html`, array buttons | No | None. |

### Shared options

Every item accepts `uuid` and `visible$`. Items that own a control (inputs, groups, arrays) also accept:

| Option | Purpose |
| --- | --- |
| `name` | Key in the parent group. |
| `validators` | Angular validators for the control. |
| `validators$` | A stream of validator arrays that replaces the validators on each emission. |
| `errorMessageMap` | Messages for each error key. |

Option based inputs add `options` and `options$`. The [API reference](/api) lists every option of every component.

## The component registry

`NgsFormsComponentRegistryService` maps keys to component classes. When the engine meets an item with `type: 'input-text'`, it asks the registry which component to create.

```ts
registry.register('input-text', NgsFormsBootstrapFormItemInputComponent);
registry.getComponentTypeForKey('input-text'); // → NgsFormsBootstrapFormItemInputComponent
```

The theme packages register their components under the same keys:

| Key | Core | Bootstrap | Material |
| --- | --- | --- | --- |
| `form-group`, `section`, `form-row`, `column`, `text-div` | ✓ | | |
| `form-array`, `form-array-list`, `form-array-add-item`, `form-array-remove-item` | ✓ | | |
| `content-html` | ✓ (register yourself) | | |
| `input-text` | | `NgsFormsBootstrapFormItemInputComponent` | `NgsFormsMaterialFormItemInputComponent` |
| `input-textarea` | | `NgsFormsBootstrapFormsItemTextAreaComponent` | `NgsFormsMaterialFormItemTextAreaComponent` |
| `checkbox` | | `NgsFormsBootstrapFormsItemCheckboxComponent` | `NgsFormsMaterialFormItemCheckboxComponent` |
| `radio` | | `NgsFormsBootstrapRadioInputComponent` | `NgsFormsMaterialRadioInputComponent` |
| `select` | | `NgsFormsBootstrapFormItemSelectInputComponent` | `NgsFormsMaterialFormItemSelectInputComponent` |

Because the keys match, a configuration built with Bootstrap `create()` helpers renders with Material components if Material is registered instead. The `create()` helper only decides the key and the config type.

> **Warning** The registry is provided in the `platform` injector, so there is one per page. Registering Material replaces the Bootstrap components for every form on the page. Use one theme per application, or register custom keys (for example `mat-input-text`) if you really need both.

## Rendering, step by step

1. `<ngs-form>` provides an internal per-form service and connects it to the `NgsFormsService` from its injector.
2. `setFormConfig()` creates a fresh root `UntypedFormGroup` and hands the config to `<ngs-form>`.
3. The `ngs-form-item` directive looks up the root item's component and creates it with an injector that carries the item (`NGS_FORMS_ITEM_DATA`) and a function to add a control to the parent group.
4. Components that own a control create it, apply validators, and add it to the parent under `name`. Groups and arrays then render their children with the same directive, passing their own control as the parent.
5. If an item has `visible$`, the directive creates the component only while the stream emits `true`, and destroys it (removing its control) when it emits `false`.

Calling `setFormConfig()` again throws the old tree away and renders the new one with a new form group.

## One service per form

`NgsFormsService` is not provided in root. Provide it on the component that hosts `<ngs-form>`:

```ts
@Component({ providers: [NgsFormsService], /* … */ })
```

Two forms on one page simply means two host components, each with its own service.

## Where to go next

- [Layout and structure](/guides/layout) shows sections, rows, columns and nested groups.
- [Validation and errors](/guides/validation) covers validators, messages and the submitted state.
- [Values, state and submission](/guides/form-state) covers reading and writing values.
