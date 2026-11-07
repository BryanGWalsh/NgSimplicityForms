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

## Toggle switch · `toggle`

`NgsFormsMaterialFormItemToggleComponent` uses `mat-slide-toggle`. Its value is `true` or `false`, or `null` until the first click. Use `Validators.requiredTrue` when it must be on; the error key is `required`.

[API reference](/api/forms-material/NgsFormsMaterialFormItemToggleComponent)

## Button group · `button-group`

`NgsFormsMaterialFormItemButtonGroupComponent` uses `mat-button-toggle-group`. With one choice the value is the chosen option's `id`; with `multiple: true` it is an array of the chosen ids, in option order. `Validators.required` requires a choice (and rejects an empty array).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | As for select. |
| `multiple` | `boolean` | `false` | Allow more than one choice. |
| `appearance` | `'standard' \| 'legacy'` | `'standard'` | Material button toggle appearance. |

[API reference](/api/forms-material/NgsFormsMaterialFormItemButtonGroupComponent)

## Range slider · `range`

`NgsFormsMaterialFormItemRangeComponent` uses `mat-slider`, with the current value next to the label. Its value is a number; a control without a value starts at `min`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `min`, `max`, `step` | `number` | `0`, `100`, `1` | |
| `showValue` | `boolean` | `true` | Show the current value next to the label. |
| `valueSuffix` | `string` | | Text after the value, such as `'%'`. Also used for `aria-valuetext`. |
| `discrete` | `boolean` | `false` | Show a value label on the thumb while dragging. |
| `showTickMarks` | `boolean` | `false` | Tick marks at each step. |

[API reference](/api/forms-material/NgsFormsMaterialFormItemRangeComponent)

## Typeahead · `typeahead`

`NgsFormsMaterialFormItemTypeaheadComponent` uses `mat-autocomplete` on a `matInput`. The options' labels are the suggestions, and the value is the text in the input, whether the user picked a suggestion or typed something else. Use `options$` to load suggestions as the user types.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | The suggestions. Disabled options are shown but cannot be picked. |
| `placeholder` | `string` | | Placeholder text. |
| `filter` | `boolean` | `true` | Show only suggestions containing the typed text (ignoring case). Turn it off when `options$` already filters. |

[API reference](/api/forms-material/NgsFormsMaterialFormItemTypeaheadComponent)

## Datepicker · `datepicker`

`NgsFormsMaterialFormItemDatepickerComponent` uses `mat-datepicker` on a `matInput`, with a calendar toggle. The value is a `Date` (or your `DateAdapter`'s date type), or `null`. It uses the `DateAdapter` your app provides, for example `provideNativeDateAdapter()` or a Luxon or date-fns adapter, and falls back to the native `Date` adapter.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `min`, `max` | `Date` | | Date limits. Out of range dates report `matDatepickerMin` / `matDatepickerMax`. |
| `startView` | `'month' \| 'year' \| 'multi-year'` | `'month'` | The view the calendar opens in. |
| `placeholder`, `hint` | `string` | | Placeholder and hint text. |

Text that is not a date reports `matDatepickerParse`, so add these keys to `errorMessageMap`.

[API reference](/api/forms-material/NgsFormsMaterialFormItemDatepickerComponent)

## Chips · `chips`

`NgsFormsMaterialFormItemChipsComponent` uses `mat-chip-grid`: the user types a value and presses Enter or comma (or leaves the field) to add it as a chip. The value is an array of strings. `Validators.required` rejects an empty list, and `Validators.maxLength(n)` limits the number of chips.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | | Placeholder of the text input. |
| `allowDuplicates` | `boolean` | `false` | Allow the same text more than once. |

[API reference](/api/forms-material/NgsFormsMaterialFormItemChipsComponent)

## Error state

The text input, textarea, select, typeahead, datepicker and chips use an `ErrorStateMatcher` that matches the library's rules: a field shows its error once it is touched or dirty, or after `setIsSubmitted(true)`. Without it, Material would only show errors for touched fields.

## Mixing with Bootstrap

The Material and Bootstrap packages register the same keys, so only one can be active on a page at a time. Structural components (sections, rows, arrays) come from the core package and work with both. The form array buttons default to Bootstrap button classes; pass `buttonClass` to style them for Material, for example `'mdc-button mat-mdc-button'` or your own classes.
