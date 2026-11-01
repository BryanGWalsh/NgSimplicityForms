# Repeating rows with form arrays

Invoices have line items, people have several phone numbers, orders have several recipients. A form array lets the user add and remove rows, and gives you an array in the form value. This tutorial builds an invoice with line items and a live total.

::: demo form-arrays

## The four pieces

A form array is assembled from four core components:

| Component | Key | Role |
| --- | --- | --- |
| `NgsFormsFormArrayContainerComponent` | `form-array` | Owns the `UntypedFormArray`. Its `name` is the key of the array in the value. |
| `NgsFormsFormArrayListComponent` | `form-array-list` | Renders `templateItem` once per row. Each row gets its own form group. |
| `NgsFormsFormArrayAddItemComponent` | `form-array-add-item` | A button that appends a row. |
| `NgsFormsFormArrayRemoveItemComponent` | `form-array-remove-item` | A button that removes the row it sits in. |

The list and the buttons must sit inside the container's `items`, because they share the array through a service the container provides.

## 1. Describe one row

The template item is any item: usually a row of inputs. Put the remove button inside it so every row gets its own.

```ts
const lineTemplate = NgsFormsRowComponent.create({
  containerClass: 'row g-2 align-items-start',
  columnClasses: ['col-sm-6', 'col-sm-2', 'col-sm-2', 'col-sm-2'],
  items: [
    NgsFormsBootstrapFormItemInputComponent.create({
      name: 'description',
      label: 'Description',
      validators: [Validators.required],
    }),
    NgsFormsBootstrapFormItemInputComponent.create({
      name: 'quantity',
      label: 'Qty',
      validators: [Validators.required, Validators.min(1)],
    }),
    NgsFormsBootstrapFormItemInputComponent.create({ name: 'price', label: 'Unit price' }),
    NgsFormsFormArrayRemoveItemComponent.create({
      buttonText: 'Remove',
      buttonIcon: 'bi bi-trash me-1',
      buttonClass: 'btn btn-outline-danger btn-sm w-100',
    }),
  ],
});
```

## 2. Add the container, list and add button

```ts
NgsFormsFormArrayContainerComponent.create({
  name: 'lines',
  initialItemCount: 2,
  minItems: 1,
  maxItems: 5,
  items: [
    NgsFormsFormArrayListComponent.create({
      templateItem: lineTemplate,
      containerClass: 'border rounded p-2 mb-2',
    }),
    NgsFormsFormArrayAddItemComponent.create({
      buttonText: 'Add line',
      buttonIcon: 'bi bi-plus-lg me-1',
      buttonClass: 'btn btn-outline-primary btn-sm',
    }),
  ],
}),
```

- `initialItemCount` is how many rows exist when the form first renders.
- `minItems` and `maxItems` stop the buttons from going below or above a limit. The buttons stay enabled; they simply do nothing at the limit.
- `containerClass` on the list styles the wrapper around each row.

The value now contains an array of row objects:

```json
{ "invoice": { "customer": "Acme", "lines": [{ "description": "Widget", "quantity": "3", "price": "2.50" }] } }
```

## 3. Derive totals with signals

Because the value is available as a signal, totals and summaries are plain `computed()` values:

```ts
private readonly value = toSignal(this.forms.formValue$);

readonly total = computed(() =>
  (this.value()?.invoice?.lines ?? []).reduce(
    (sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.price) || 0),
    0
  )
);
```

```html
<ngs-form></ngs-form>
<div class="text-end fw-semibold">Total: {{ total() | currency }}</div>
```

## Validation inside rows

Validators on the row's inputs work as usual, and an invalid row makes the whole form invalid. Each row's errors are independent: the messages appear under the field in the row that has the problem.

## Adding rows from code

The add and remove buttons talk to `NgsFormsFormArrayInternalService`, which is provided by the container. A custom component placed inside the container can inject it and call `addItem()` or `removeAt(index)` directly. To start with a known number of rows (for example when editing saved data) set `initialItemCount` when you build the configuration, as shown in [Editing existing data](/tutorials/editing-data).

> **Note** Text inputs return strings, so convert numbers yourself (`Number(line.quantity)`) before doing arithmetic.

Next: [Cascading selects](/tutorials/cascading-selects).
