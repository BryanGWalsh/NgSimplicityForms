# @ng-simplicity/forms-tailwind

Tailwind CSS styled form controls for the [@ng-simplicity/forms-core](https://www.npmjs.com/package/@ng-simplicity/forms-core) engine. It registers the same keys as the Bootstrap and Material packages (`input-text`, `input-textarea`, `checkbox`, `radio`, `select`), so the same form configuration renders with Tailwind. The components are native HTML controls styled with utility classes, and every class can be replaced through a provider.

## Compatibility

| Package | Package version | Angular support | Tailwind CSS | Requires |
|---|---:|---|---|---|
| `@ng-simplicity/forms-tailwind` | `1.1.6` | `17.x`–`22.x` | v4 (recommended) or v3 | `@ng-simplicity/forms-core ^1.1.6` |

Requires `@ng-simplicity/forms-core` `^1.1.6`. From 1.1.2 every package declares `uuid` as a dependency, so it no longer needs to be installed separately.

---

## Installation

Set up Tailwind in your application first (see [Tailwind's Angular guide](https://tailwindcss.com/docs/installation/framework-guides/angular)), then install the packages:

```bash
npm install @ng-simplicity/forms-core @ng-simplicity/forms-tailwind
```

Tailwind only generates classes it finds in your sources and skips `node_modules`, so point it at this package. With Tailwind v4, in the stylesheet that imports Tailwind (the path is relative to that file):

```css
@import 'tailwindcss';
@source '../node_modules/@ng-simplicity/forms-tailwind';
```

With Tailwind v3, add it to `content` in `tailwind.config.js`:

```js
content: ['./src/**/*.{html,ts}', './node_modules/@ng-simplicity/forms-tailwind/**/*.mjs'],
```

---

## Quick Start

```typescript
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindFormItemSelectInputComponent,
  NgsFormsTailwindModule,
} from '@ng-simplicity/forms-tailwind';

@Component({
  selector: 'app-profile-form',
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button type="button" class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white" (click)="submit()">Save</button>
  `,
})
export class ProfileFormComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    NgsFormsTailwindModule.registerAllTailwindComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 150,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'profile',
        items: [
          NgsFormsRowComponent.create({
            containerClass: 'grid gap-x-4 sm:grid-cols-2',
            items: [
              NgsFormsTailwindFormItemInputComponent.create({
                name: 'firstName',
                label: 'First name',
                validators: [Validators.required],
                errorMessageMap: { required: 'First name is required.' },
              }),
              NgsFormsTailwindFormItemInputComponent.create({ name: 'lastName', label: 'Last name' }),
            ],
          }),
          NgsFormsTailwindFormItemSelectInputComponent.create({
            name: 'plan',
            label: 'Plan',
            placeholder: 'Choose a plan',
            options: [
              { id: 'free', label: 'Free' },
              { id: 'pro', label: 'Pro' },
            ],
          }),
        ],
      }),
    });
  }

  submit() {
    this.forms.setIsSubmitted(true);
    if (this.forms.isValid) {
      console.log(this.forms.formValue);
    }
  }
}
```

---

## Components

| Key | Component | Config | Notable options |
|---|---|---|---|
| `input-text` | `NgsFormsTailwindFormItemInputComponent` | `NgsFormsFormItemConfigTailwindTextInput` | `type`, `placeholder`, `labelLocation` (`top` / `left`), `inputCssClass` |
| `input-textarea` | `NgsFormsTailwindFormItemTextAreaComponent` | `NgsFormsFormItemConfigTailwindTextArea` | `placeholder`, `labelLocation`, `inputCssClass` |
| `select` | `NgsFormsTailwindFormItemSelectInputComponent` | `NgsFormsFormItemConfigTailwindSelectInput` | `options`, `options$`, `placeholder`, `placeHolderValue`, `labelLocation`, `inputCssClass` |
| `radio` | `NgsFormsTailwindRadioInputComponent` | `NgsFormsFormItemConfigTailwindRadio` | `options`, `options$`, `alignment` (`vertical` / `horizontal`) |
| `checkbox` | `NgsFormsTailwindFormItemCheckboxComponent` | `NgsFormsFormItemConfigTailwindCheckbox` | Use `Validators.requiredTrue` for consent boxes |
| `toggle` | `NgsFormsTailwindFormItemToggleComponent` | `NgsFormsFormItemConfigTailwindToggle` | A switch; value `true` / `false` |
| `button-group` | `NgsFormsTailwindFormItemButtonGroupComponent` | `NgsFormsFormItemConfigTailwindButtonGroup` | `options`, `options$`, `multiple` (value becomes an array of ids) |
| `range` | `NgsFormsTailwindFormItemRangeComponent` | `NgsFormsFormItemConfigTailwindRange` | `min`, `max`, `step`, `showValue`, `valueSuffix` |
| `typeahead` | `NgsFormsTailwindFormItemTypeaheadComponent` | `NgsFormsFormItemConfigTailwindTypeahead` | `options`, `options$` (labels are the suggestions), `placeholder`; value is the typed text |

All of them also take the shared core options (`visible$`, `disabled`, `validators`, `validators$`, `errorMessageMap`, ...). See the [forms-core README](https://www.npmjs.com/package/@ng-simplicity/forms-core).

---

## Customising the classes

The components read their classes from the `NGS_FORMS_TAILWIND_CLASSES` injection token. Override any slot with `provideNgsFormsTailwindClasses()`; slots you leave out keep the values in `NGS_FORMS_TAILWIND_DEFAULT_CLASSES`.

```typescript
import { provideNgsFormsTailwindClasses } from '@ng-simplicity/forms-tailwind';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgsFormsTailwindClasses({
      controlValid: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/40',
      choiceInput: 'h-4 w-4 cursor-pointer accent-emerald-600',
      error: 'mt-1 text-xs font-medium text-rose-600',
    }),
  ],
});
```

Provide it in a component's `providers` instead to restyle only the forms inside that component. Write override classes out in full so Tailwind can find them in your sources.

The slots are `field`, `fieldHorizontal`, `label`, `labelHorizontal`, `labelValid`, `labelInvalid`, `controlWrapperHorizontal`, `control`, `controlValid`, `controlInvalid`, `textarea`, `checkboxField`, `choice`, `choiceInput`, `choiceInputInvalid`, `choiceLabel`, `radioGroup`, `radioOptions`, `radioOptionsHorizontal`, `radioGroupLabel` and `error`. The `*Valid` / `*Invalid` pairs are swapped when a field shows an error, so keep colours there and layout in the base slot.

### Dark mode

The default classes include `dark:` variants (light label text, dark control backgrounds). In Tailwind v4, `dark:` follows the device's `prefers-color-scheme` by default, so **an app without a dark theme gets light labels on its white page when the device is in dark mode**. If your app has no dark theme, tie `dark:` to a class you never set, in the stylesheet that imports Tailwind:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

The controls then stay light until an element has the `dark` class. With Tailwind v3, set `darkMode: 'class'` (or `'selector'`) in `tailwind.config.js` instead, which does the same.

---

## Accessibility

Every control has a `<label for>` (radio groups use `role="radiogroup"` with `aria-labelledby`). Error messages are linked with `aria-describedby` and announced through a polite live region. Invalid inputs get `aria-invalid="true"`, controls with `Validators.required` get `aria-required="true"`, and the radios in a group share a `name`, so the group is a single tab stop.

## Documentation

Full guides and live demos: the docs site in this repository (`apps/docs`), pages "Quick start: Tailwind CSS" and "Tailwind components".
