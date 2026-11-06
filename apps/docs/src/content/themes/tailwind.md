# Tailwind components

`@ng-simplicity/forms-tailwind` renders native inputs styled with Tailwind CSS utility classes. It ships no CSS of its own: your Tailwind build generates the classes, so add the package as a source (see [Installation](/getting-started/installation#with-tailwind-css)).

```ts
NgsFormsTailwindModule.registerAllTailwindComponents(registry);
```

::: demo tailwind-catalog

## Text input · `input-text`

`NgsFormsTailwindFormItemInputComponent` renders an `<input>` with its label and error.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | | Control name. |
| `label` | `string` | | Label text. |
| `type` | `'text' \| 'email' \| 'password'` | `'text'` | Input type. |
| `placeholder` | `string` | | Placeholder text. |
| `labelLocation` | `'top' \| 'left'` | `'top'` | `left` puts the label in a 2 / 10 column grid from the `sm` breakpoint up. |
| `inputCssClass` | `string` | | Extra classes on the `<input>`. |
| `value`, `id`, `disabled`, `disabled$`, `visible`, `visible$`, `validators`, `validators$`, `errorMessageMap` | | | See [Core concepts](/guides/core-concepts#shared-options). |

[API reference](/api/forms-tailwind/NgsFormsTailwindFormItemInputComponent)

## Textarea · `input-textarea`

`NgsFormsTailwindFormItemTextAreaComponent` renders a `<textarea>` (`h-52` by default, set by the `textarea` class slot).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `label`, `placeholder` | `string` | | |
| `labelLocation` | `'top' \| 'left'` | `'top'` | |
| `inputCssClass` | `string` | | Extra classes on the `<textarea>`. |

[API reference](/api/forms-tailwind/NgsFormsTailwindFormItemTextAreaComponent)

## Select · `select`

`NgsFormsTailwindFormItemSelectInputComponent` renders a native `<select>`. The value is the chosen option's `id`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `NgsFormsFormInputOption[]` | | `{ id, label, disabled? }` entries. |
| `options$` | `Observable<NgsFormsFormInputOption[]>` | | Replaces the options on each emission. |
| `placeholder` | `string` | | A disabled first option used as a prompt. |
| `placeHolderValue` | `string` | `''` | Value of the placeholder option. |
| `labelLocation` | `'top' \| 'left'` | `'top'` | Unlike the Bootstrap select, the label is on top unless you ask for `left`. |
| `inputCssClass` | `string` | | Extra classes on the `<select>`. |

[API reference](/api/forms-tailwind/NgsFormsTailwindFormItemSelectInputComponent)

## Radio group · `radio`

`NgsFormsTailwindRadioInputComponent` renders one radio button per option inside a `role="radiogroup"`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `options`, `options$` | | | As for select. |
| `alignment` | `'vertical' \| 'horizontal'` | `'vertical'` | `horizontal` shows the label and options on one wrapping line. |

[API reference](/api/forms-tailwind/NgsFormsTailwindRadioInputComponent)

## Checkbox · `checkbox`

`NgsFormsTailwindFormItemCheckboxComponent` renders a single checkbox. Its value is `true` or `false`, or `null` until the first click. Use `Validators.requiredTrue` for consent boxes; the error key is `required`.

[API reference](/api/forms-tailwind/NgsFormsTailwindFormItemCheckboxComponent)

## Customising the classes

The components read their classes from the `NGS_FORMS_TAILWIND_CLASSES` token. `provideNgsFormsTailwindClasses()` merges your overrides into `NGS_FORMS_TAILWIND_DEFAULT_CLASSES`. Provide it in your application config to restyle every form, or in a component's `providers` to restyle only the forms inside it.

```ts
providers: [
  provideNgsFormsTailwindClasses({
    control: 'block w-full rounded-lg border px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2',
    controlValid: 'border-slate-300 focus:border-violet-500 focus:ring-violet-500/40',
    error: 'mt-1 text-xs font-medium text-rose-600',
  }),
],
```

| Slot | Used for |
| --- | --- |
| `field`, `fieldHorizontal` | Wrapper of a field, stacked or with the label on the left. |
| `label`, `labelHorizontal` | Label layout and type. |
| `labelValid`, `labelInvalid` | Label colour; swapped when the field shows an error. Also used for checkbox and radio labels. |
| `controlWrapperHorizontal` | Holds the control and error in the horizontal layout. |
| `control` | Text inputs, selects and textareas. |
| `controlValid`, `controlInvalid` | Border and focus ring; swapped when the field shows an error. |
| `textarea` | Added to the textarea (its height). |
| `checkboxField`, `choice`, `choiceInput`, `choiceInputInvalid`, `choiceLabel` | Checkbox and radio rows. |
| `radioGroup`, `radioOptions`, `radioOptionsHorizontal`, `radioGroupLabel` | Radio group layout. |
| `error` | The validation message. |

> **Tip** Write override classes out in full, as above. Tailwind finds classes by scanning your source files, so a class built from pieces at runtime (`'border-' + color`) is never generated.

## Dark mode

The default classes include `dark:` variants, so the controls follow Tailwind's dark mode. By default that is the operating system setting; use `@custom-variant dark (...)` in your stylesheet to tie it to a class or attribute instead.

## Accessibility

Every control has a `<label for>` (or `aria-labelledby` for radio groups). Error messages are linked with `aria-describedby` and announced through a polite live region. Invalid inputs get `aria-invalid="true"`, controls with `Validators.required` get `aria-required="true"`, and the radios in a group share a `name`, so the group is a single tab stop.

## Layout

The core layout components take any classes, so Tailwind grids work for rows:

```ts
NgsFormsRowComponent.create({
  containerClass: 'grid gap-x-4 sm:grid-cols-2',
  items: [firstName, lastName],
})
```

Sections render `.form-section`, `.form-section-title` and `.form-section-subtitle`. Style them in your stylesheet, for example with `@apply`, or pass `titleClass` and `subtitleClass` on the section.
