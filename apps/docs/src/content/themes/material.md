# Material components

`@ng-simplicity/forms-material` renders inputs with Angular Material. Text inputs, textareas and selects use an outlined `mat-form-field`; errors appear in `mat-error`.

```ts
NgsFormsMaterialModule.registerAllMaterialComponents(registry);
```

You need a Material theme, `provideAnimationsAsync()`, and a few supporting styles. See the [Material quick start](/getting-started/material#4-add-the-supporting-styles).

::: demo material-catalog

Every component also takes the [shared options](/guides/core-concepts#shared-options), including `value`, `id`, `disabled$` and `visible$`. A configured `id` is passed to Material, which otherwise generates its own.

## Text input · `input-text`

`NgsFormsMaterialFormItemInputComponent` uses `matInput` in an outlined form field.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | | Rendered as `mat-label`. |
| `type` | `'text' \| 'email' \| 'password'` | `'text'` | |
| `placeholder` | `string` | | |

[API reference](/api/forms-material/NgsFormsMaterialFormItemInputComponent)

## Textarea · `input-textarea`

`NgsFormsMaterialFormItemTextAreaComponent` adds a `rows` option (default `3`).

[API reference](/api/forms-material/NgsFormsMaterialFormItemTextAreaComponent)

## Select · `select`

`NgsFormsMaterialFormItemSelectInputComponent` uses `mat-select`. It supports `options`, `options$`, `placeholder` and `placeHolderValue`.

[API reference](/api/forms-material/NgsFormsMaterialFormItemSelectInputComponent)

## Radio group · `radio`

`NgsFormsMaterialRadioInputComponent` uses `mat-radio-group`, with `alignment: 'vertical' | 'horizontal'`. The layout of the group comes from the `ngs-material-radio-*` classes in your stylesheet.

[API reference](/api/forms-material/NgsFormsMaterialRadioInputComponent)

## Checkbox · `checkbox`

`NgsFormsMaterialFormItemCheckboxComponent` uses `mat-checkbox`.

[API reference](/api/forms-material/NgsFormsMaterialFormItemCheckboxComponent)

## Error state

The text input, textarea and select use an `ErrorStateMatcher` that matches the library's rules: a field shows its error once it is touched or dirty, or after `setIsSubmitted(true)`. Without it, Material would only show errors for touched fields.

## Mixing with Bootstrap

The Material and Bootstrap packages register the same keys, so only one can be active on a page at a time. Structural components (sections, rows, arrays) come from the core package and work with both. The form array buttons default to Bootstrap button classes; pass `buttonClass` to style them for Material, for example `'mdc-button mat-mdc-button'` or your own classes.
