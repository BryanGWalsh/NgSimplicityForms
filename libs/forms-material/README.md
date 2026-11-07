# @ng-simplicity/forms-material

[![Documentation](https://img.shields.io/badge/Docs-ng--simplicity--forms.bryangwalsh.com-4f46e5.svg)](https://ng-simplicity-forms.bryangwalsh.com)

📖 **Documentation, tutorials and live demos:** [ng-simplicity-forms.bryangwalsh.com](https://ng-simplicity-forms.bryangwalsh.com) · [Component reference](https://ng-simplicity-forms.bryangwalsh.com/themes/material) · [API reference](https://ng-simplicity-forms.bryangwalsh.com/api)

An integration package containing pre-styled Angular Material inputs, form fields, and error templates. It serves as a visual UI extension of the reactive [@ng-simplicity/forms-core](https://www.npmjs.com/package/@ng-simplicity/forms-core) engine, inheriting its powerful dynamic capabilities. This allows you to construct highly dynamic, complex forms where control properties (such as visibility, enabled/disabled state, select options, and validation rules) reactively adapt in real-time based on the current values inside the form. The package is highly customizable; because it utilizes the core registry system, you can develop and add your own custom form controls to the registry to be used in the form rendering alongside the Material presets.

## Compatibility

| Package | Package version | Angular support | Angular Material support | Requires |
|---|---:|---|---|---|
| `@ng-simplicity/forms-material` | `1.1.5` | `17.x`–`22.x` | `17.x`–`22.x` (use the matching Angular major) | `@ng-simplicity/forms-core ^1.1.5` |

Requires `@ng-simplicity/forms-core` `^1.1.5`. From 1.1.2 every package declares `uuid` as a dependency, so it no longer needs to be installed separately.

---

## Installation

Ensure you have `@angular/material` and the core forms package installed:

```bash
npm install @ng-simplicity/forms-core @ng-simplicity/forms-material @angular/material @angular/cdk
```

Make sure your application has active Material theming configured (either via an custom theme file or prebuilt stylesheets in `angular.json` / `styles.scss`):
```scss
@import "@angular/material/prebuilt-themes/indigo-pink.css";
```

---

## Quick Start & Registration

To render Material fields dynamically, follow these steps:
1. Provide the `NgsFormsService` at the component level to isolate the form state.
2. Register the Material components in your component constructor using `NgsFormsMaterialModule.registerAllMaterialComponents(registry)`.
3. Construct the layout schema (`NgsFormsFormConfig`) using Material controls.
4. Pass the schema to `this.ngsFormsService.setFormConfig(formConfig)`.
5. Add `<ngs-form></ngs-form>` to your component's template.

Here is a complete usage example:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { 
  NgsFormComponent,
  NgsFormsComponentRegistryService, 
  NgsFormsService, 
  NgsFormsFormConfig, 
  NgsFormsFormGroupComponent,
  NgsFormsRowComponent
} from '@ng-simplicity/forms-core';
import { 
  NgsFormsMaterialModule,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent
} from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-material-form-page',
  standalone: true,
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  template: `
    <div class="material-form-container">
      <h2>Contact Us</h2>
      <ngs-form></ngs-form>
      <button (click)="onSubmit()">Submit</button>
    </div>
  `
})
export class MaterialFormPageComponent implements OnInit {
  private ngsFormsService = inject(NgsFormsService);

  constructor(registry: NgsFormsComponentRegistryService) {
    // Registers Material inputs, textareas, checkbox, select, and layouts
    NgsFormsMaterialModule.registerAllMaterialComponents(registry);
  }

  ngOnInit() {
    // Construct the form configuration
    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 150,
      root: NgsFormsFormGroupComponent.create({
        name: 'contactForm',
        items: [
          NgsFormsRowComponent.create({
            items: [
              NgsFormsMaterialFormItemInputComponent.create({
                name: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email...',
                type: 'email',
                validators: [Validators.required, Validators.email],
                errorMessageMap: {
                  required: 'Email address is required.',
                  email: 'Please enter a valid email address.'
                }
              }),
              NgsFormsMaterialFormItemTextAreaComponent.create({
                name: 'message',
                label: 'Your Message',
                placeholder: 'Write your message...',
                rows: 4
              })
            ]
          })
        ]
      })
    };

    // Initialize the dynamic form controls
    this.ngsFormsService.setFormConfig(formConfig);
  }

  onSubmit() {
    if (this.ngsFormsService.isValid) {
      console.log('Form data submitted:', this.ngsFormsService.formValue);
    } else {
      this.ngsFormsService.setIsSubmitted(true); // Highlights form validation errors
    }
  }
}
```

---

## Common Properties & Core Integration

This package relies on the main core engine: [@ng-simplicity/forms-core](https://www.npmjs.com/package/@ng-simplicity/forms-core). The core package provides all standard layout structures and non-styling-specific form components, including:
- **Form Groups**: `NgsFormsFormGroupComponent` (Key: `'form-group'`)
- **Sections**: `NgsFormsFormSectionComponent` (Key: `'section'`)
- **Row Containers**: `NgsFormsRowComponent` (Key: `'form-row'`)
- **Columns**: `NgsFormsColumnComponent` (Key: `'column'`)
- **Form Arrays & Support**: `NgsFormsFormArrayContainerComponent` (Key: `'form-array'`), `NgsFormsFormArrayAddItemComponent` (Key: `'form-array-add-item'`), and `NgsFormsFormArrayRemoveItemComponent` (Key: `'form-array-remove-item'`)
- **Static Content**: `NgsFormsHtmlContentComponent` (Key: `'content-html'`) and `NgsFormsTextDivComponent` (Key: `'text-div'`)

Please refer to the [@ng-simplicity/forms-core README](file:///home/bryan/git/bryan-projects/angular-open-source/ng-simplicity/forms/libs/forms-core/README.md) for full details on constructing layouts and managing core form structures.

### Common Control Properties

Most controls in this styling library support a standard set of core properties that are managed by the dynamic forms engine. These properties allow passing either a static/basic value or an asynchronous stream (Observable):

1. **Visibility**:
   - `visible` (boolean): Controls whether the item is mounted in the DOM.
   - `visible$` (`Observable<boolean>`): Stream version to dynamically show/hide components.
   - *Note: Visibility is configured at the inner config level (`NgsFormsFormItemConfigBase`).*

2. **Disabled Status**:
   - `disabled` (boolean): Sets the initial disabled state of the form control.
   - `disabled$` (`Observable<boolean>`): Stream to toggle disabled state.
   - *Configured at the inner `config` level.*

3. **Validators**:
   - `validators` (`Array<ValidatorFn>`): Array of standard/custom Angular Validator functions.
   - `validators$` (`Observable<Array<ValidatorFn>>`): Stream of validator functions to change validators dynamically.
   - *Configured at the inner `config` level.*

4. **Options** (Only for components with choice selection like `select` and `radio`):
   - `options` (`Array<NgsFormsFormInputOption>`): Static array of choices `{ id: string | number, label: string, disabled?: boolean }`.
   - `options$` (`Observable<Array<NgsFormsFormInputOption>>`): Stream to dynamically populate choices.
   - *Configured at the inner `config` level.*

> [!TIP]
> By supplying **Observable** streams (such as `visible$`, `disabled$`, `validators$`, or `options$`), you can build highly dynamic and reactive forms. Because these observables can be piped directly from the form service's value change stream (`this.ngsFormsService.formValue$`), fields can dynamically enable/disable, appear/disappear, change options, or update validation rules in real-time based on user input in other fields.

---

## Available Components & Schemas

Here is the full list of available Material components along with code examples showing their required and optional configuration parameters:

### 1. Text Input (`input-text`)
Uses `NgsFormsMaterialFormItemInputComponent`.
- **Key**: `input-text`
- **Config Type**: `NgsFormsFormItemConfigMaterialTextInput` (the same fields as `NgsFormsFormItemConfigBaseTextInput`)

```typescript
import { NgsFormsMaterialFormItemInputComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const emailField = NgsFormsMaterialFormItemInputComponent.create({
  // Required Parameters
  name: 'email',
  label: 'Email Address',

  // Optional Parameters
  id: 'custom-email-id',
  placeholder: 'Enter your email address...',
  type: 'email', // 'text' | 'email' | 'password'
  value: 'default@domain.com', // Initial value
  disabled: false,
  validators: [Validators.required, Validators.email],
  errorMessageMap: {
    required: 'Email is required.',
    email: 'Must be a valid email format.'
  }
});
```

### 2. Text Area (`input-textarea`)
Uses `NgsFormsMaterialFormItemTextAreaComponent`.
- **Key**: `input-textarea`
- **Config Type**: `NgsFormsFormItemConfigMaterialTextArea` (the input fields plus `placeholder` and `rows`)

```typescript
import { NgsFormsMaterialFormItemTextAreaComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const commentsField = NgsFormsMaterialFormItemTextAreaComponent.create({
  // Required Parameters
  name: 'comments',
  label: 'Comments',

  // Optional Parameters
  id: 'custom-comments-id',
  placeholder: 'Leave us feedback...',
  value: '',
  rows: 5, // Custom number of visible rows (default is 3)
  disabled: false,
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Comments cannot be blank.'
  }
});
```

### 3. Checkbox (`checkbox`)
Uses `NgsFormsMaterialFormItemCheckboxComponent`.
- **Key**: `checkbox`
- **Config Type**: `NgsFormsFormItemConfigBaseInput`

```typescript
import { NgsFormsMaterialFormItemCheckboxComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const acceptTermsField = NgsFormsMaterialFormItemCheckboxComponent.create({
  // Required Parameters
  name: 'agreeTerms',
  label: 'I accept the Terms and Conditions',

  // Optional Parameters
  id: 'terms-checkbox-id',
  value: false, // Initial checked state
  disabled: false,
  validators: [Validators.requiredTrue],
  errorMessageMap: {
    required: 'You must agree to the terms to proceed.'
  }
});
```

### 4. Select Dropdown (`select`)
Uses `NgsFormsMaterialFormItemSelectInputComponent`.
- **Key**: `select`
- **Config Type**: `NgsFormsFormItemConfigMaterialSelectInput`

```typescript
import { NgsFormsMaterialFormItemSelectInputComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const roleSelectField = NgsFormsMaterialFormItemSelectInputComponent.create({
  // Required Parameters
  name: 'role',
  label: 'User Role',

  // Optional Parameters
  id: 'role-select-id',
  placeholder: 'Choose a role...', // Disabled placeholder text
  placeHolderValue: '', // Custom value for placeholder selection
  value: 'member', // Initial selected option ID
  disabled: false,
  options: [
    { id: 'admin', label: 'Administrator' },
    { id: 'member', label: 'Regular Member', disabled: false },
    { id: 'guest', label: 'Guest User', disabled: true }
  ],
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Please select a role.'
  }
});
```

### 5. Radio Buttons (`radio`)
Uses `NgsFormsMaterialRadioInputComponent`.
- **Key**: `radio`
- **Config Type**: `NgsFormsFormItemConfigMaterialRadio`

```typescript
import { NgsFormsMaterialRadioInputComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const genderField = NgsFormsMaterialRadioInputComponent.create({
  // Required Parameters
  name: 'gender',
  label: 'Gender Identity',

  // Optional Parameters
  id: 'gender-radio-id',
  value: 'other', // Initial selected radio option ID
  alignment: 'horizontal', // 'horizontal' | 'vertical' (default is 'vertical')
  disabled: false,
  options: [
    { id: 'female', label: 'Female' },
    { id: 'male', label: 'Male' },
    { id: 'other', label: 'Other/Prefer not to say' }
  ],
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Please choose one option.'
  }
});
```

### 6. Toggle Switch (`toggle`)
Uses `NgsFormsMaterialFormItemToggleComponent`. Value: `true` / `false`.

```typescript
const updatesField = NgsFormsMaterialFormItemToggleComponent.create({
  name: 'productUpdates',
  label: 'Send me product updates',
  value: false,
});
```

### 7. Button Group (`button-group`)
Uses `NgsFormsMaterialFormItemButtonGroupComponent`. Value: the chosen option `id`, or an array of ids with `multiple: true`.

```typescript
const planField = NgsFormsMaterialFormItemButtonGroupComponent.create({
  name: 'plan',
  label: 'Plan',
  multiple: false, // true allows several choices
  options: [
    { id: 'basic', label: 'Basic' },
    { id: 'pro', label: 'Pro' },
  ],
  validators: [Validators.required],
  errorMessageMap: { required: 'Choose a plan.' },
});
```

### 8. Range Slider (`range`)
Uses `NgsFormsMaterialFormItemRangeComponent`. Value: a number, starting at `min`.

```typescript
const experienceField = NgsFormsMaterialFormItemRangeComponent.create({
  name: 'experience',
  label: 'Years of Experience',
  min: 0,
  max: 40,
  step: 1,
  valueSuffix: ' yrs', // shown after the value
});
```

### 9. Typeahead (`typeahead`)
Uses `NgsFormsMaterialFormItemTypeaheadComponent`. The option labels are the suggestions; the value is the text in the input.

```typescript
const cityField = NgsFormsMaterialFormItemTypeaheadComponent.create({
  name: 'city',
  label: 'City',
  placeholder: 'Start typing a city',
  options: [{ id: 'berlin', label: 'Berlin' }, { id: 'boston', label: 'Boston' }],
  // options$: load suggestions from a server as the user types
});
```

### 10. Datepicker (`datepicker`)
Uses `NgsFormsMaterialFormItemDatepickerComponent`. Value: a `Date` (or your `DateAdapter`'s type). Uses your app's `DateAdapter` and falls back to the native one.

```typescript
const startDateField = NgsFormsMaterialFormItemDatepickerComponent.create({
  name: 'startDate',
  label: 'Available From',
  min: new Date(2020, 0, 1),
  hint: 'MM/DD/YYYY',
  errorMessageMap: {
    matDatepickerParse: 'Enter a valid date.',
    matDatepickerMin: 'Choose a date from 2020 onwards.',
  },
});
```

### 11. Chips (`chips`)
Uses `NgsFormsMaterialFormItemChipsComponent`. Value: an array of strings; Enter or comma adds a chip.

```typescript
const skillsField = NgsFormsMaterialFormItemChipsComponent.create({
  name: 'skills',
  label: 'Skills',
  placeholder: 'Type a skill and press Enter',
  allowDuplicates: false,
});
```

---

## Unit Testing

Run unit tests for this Material integration package using:

```bash
nx test forms-material
```

To run with coverage enabled:
```bash
nx test forms-material --codeCoverage
```

---

## Example Applications

Fully functional example applications demonstrating the form engine functionality are located in the [`apps/`](../../apps) folder of this monorepo:
- **`forms-bootstrap-demo`**: Integrates and showcases the `@ng-simplicity/forms-bootstrap` package.
- **`forms-material-demo`**: Integrates and showcases the `@ng-simplicity/forms-material` package.

---

## Support & Contributions

If you have feature suggestions, need a feature to make `@ng-simplicity/forms-material` work for your project, or encounter any bugs, please log an issue in the GitHub issue tracker.
