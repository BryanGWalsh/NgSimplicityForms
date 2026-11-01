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
| `validators`, `validators$`, `errorMessageMap`, `visible$` | | | See [Core concepts](/guides/core-concepts#shared-options). |

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

## Accessibility

Every control has a `<label for>` (or `aria-labelledby` for radio groups), and error messages are linked with `aria-describedby`. Invalid controls get the `border-danger` class and their labels `text-danger`.

## Styling tips

The components use stock Bootstrap classes, so Bootstrap themes and CSS variables apply. The core layout components add these hooks:

```scss
.form-section { margin-bottom: 2rem; }
.form-section-title { font-weight: 600; }
.form-section-subtitle { color: var(--bs-secondary-color); }
```
