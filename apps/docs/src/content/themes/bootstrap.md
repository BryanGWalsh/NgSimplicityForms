# Bootstrap components

`@ng-simplicity/forms-bootstrap` renders inputs with Bootstrap 5 markup and classes. Load Bootstrap's CSS in your application; the package does not ship styles of its own.

```ts
NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
```

::: demo bootstrap-catalog

## Text input · `input-text`

`NgsFormsBootstrapFormItemInputComponent` renders a `.form-control` with its label and error.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | | Control name. |
| `label` | `string` | | Label text. |
| `type` | `'text' \| 'email' \| 'password'` | `'text'` | Input type. |
| `placeholder` | `string` | | Placeholder text. |
| `labelLocation` | `'top' \| 'left'` | `'top'` | `left` renders a horizontal `col-sm-2` / `col-sm-10` row. |
| `value`, `id`, `disabled`, `disabled$`, `visible`, `visible$`, `validators`, `validators$`, `errorMessageMap` | | | See [Core concepts](/guides/core-concepts#shared-options). |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemInputComponent)

## Textarea · `input-textarea`

`NgsFormsBootstrapFormsItemTextAreaComponent` renders a 210px tall `.form-control` textarea.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `label`, `placeholder` | `string` | | |
| `labelLocation` | `'top' \| 'left'` | `'top'` | |
| `inputCssClass` | `string` | | Extra classes on the `<textarea>`. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormsItemTextAreaComponent)

## Select · `select`

`NgsFormsBootstrapFormItemSelectInputComponent` renders a `.form-select`. The value is the chosen option's `id`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `NgsFormsFormInputOption[]` | | `{ id, label, disabled? }` entries. |
| `options$` | `Observable<NgsFormsFormInputOption[]>` | | Replaces the options on each emission. |
| `placeholder` | `string` | | A disabled first option used as a prompt. |
| `placeHolderValue` | `string` | `''` | Value of the placeholder option. |
| `labelLocation` | `'top' \| 'left'` | horizontal | Set `'top'` explicitly for a stacked label: any other value renders the horizontal layout. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemSelectInputComponent)

## Radio group · `radio`

`NgsFormsBootstrapRadioInputComponent` renders one `.form-check` per option inside a `role="radiogroup"`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | As for select. |
| `alignment` | `'vertical' \| 'horizontal'` | `'vertical'` | `horizontal` shows the options inline. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapRadioInputComponent)

## Checkbox · `checkbox`

`NgsFormsBootstrapFormsItemCheckboxComponent` renders a single `.form-check`. Its value is `true` or `false`, or `null` until the first click. Use `Validators.requiredTrue` for consent boxes; the error key is `required`.

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormsItemCheckboxComponent)

## Toggle switch · `toggle`

`NgsFormsBootstrapFormItemToggleComponent` renders a `.form-check.form-switch` with `role="switch"`. Its value is `true` or `false`, or `null` until the first click. Use `Validators.requiredTrue` when it must be on; the error key is `required`.

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemToggleComponent)

## Button group · `button-group`

`NgsFormsBootstrapFormItemButtonGroupComponent` renders a `.btn-group` of `.btn-check` radios (or checkboxes with `multiple`). With one choice the value is the chosen option's `id`; with `multiple: true` it is an array of the chosen ids, in option order. `Validators.required` requires a choice (and rejects an empty array).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | As for select. |
| `multiple` | `boolean` | `false` | Allow more than one choice. |
| `buttonClass` | `string` | `'btn-outline-primary'` | Button variant on every option. |
| `size` | `'sm' \| 'lg'` | | Button group size. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemButtonGroupComponent)

## Range slider · `range`

`NgsFormsBootstrapFormItemRangeComponent` renders a `.form-range` with the current value in an `<output>`. Its value is a number; a control without a value starts at `min`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `min`, `max`, `step` | `number` | `0`, `100`, `1` | |
| `showValue` | `boolean` | `true` | Show the current value next to the label. |
| `valueSuffix` | `string` | | Text after the value, such as `'%'`. Also used for `aria-valuetext`. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemRangeComponent)

## Typeahead · `typeahead`

`NgsFormsBootstrapFormItemTypeaheadComponent` renders a `.form-control` with a `<datalist>`, so the browser shows and filters the suggestions. The options' labels are the suggestions, and the value is the text in the input, whether the user picked a suggestion or typed something else. Use `options$` to load suggestions as the user types.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | The suggestions. Disabled options are left out. |
| `placeholder` | `string` | | Placeholder text. |

[API reference](/api/forms-bootstrap/NgsFormsBootstrapFormItemTypeaheadComponent)

## Accessibility

Every control has a `<label for>` (or `aria-labelledby` for radio groups), and error messages are linked with `aria-describedby` and announced through a polite live region. Invalid controls get `aria-invalid="true"`, the `border-danger` class and a `text-danger` label. Controls with `Validators.required` get `aria-required="true"`, and the radios in a group share a `name`, so the group is a single tab stop.

## Styling tips

The components use stock Bootstrap classes, so Bootstrap themes and CSS variables apply. The core layout components add these hooks:

```scss
.form-section { margin-bottom: 2rem; }
.form-section-title { font-weight: 600; }
.form-section-subtitle { color: var(--bs-secondary-color); }
```
