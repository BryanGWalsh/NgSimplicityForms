# @ng-simplicity/forms-bootstrap

[![Documentation](https://img.shields.io/badge/Docs-ng--simplicity--forms.bryangwalsh.com-4f46e5.svg)](https://ng-simplicity-forms.bryangwalsh.com)

📖 **Documentation, tutorials and live demos:** [ng-simplicity-forms.bryangwalsh.com](https://ng-simplicity-forms.bryangwalsh.com) · [Component reference](https://ng-simplicity-forms.bryangwalsh.com/themes/bootstrap) · [API reference](https://ng-simplicity-forms.bryangwalsh.com/api)

A package containing pre-styled Bootstrap form inputs, containers, and templates. It serves as a visual UI extension of the reactive [@ng-simplicity/forms-core](https://www.npmjs.com/package/@ng-simplicity/forms-core) engine, inheriting its powerful dynamic capabilities. This allows you to construct highly dynamic, complex forms where control properties (such as visibility, enabled/disabled state, select options, and validation rules) reactively adapt in real-time based on the current values inside the form. The package is highly customizable; because it utilizes the core registry system, you can develop and add your own custom form controls to the registry to be used in the form rendering alongside the Bootstrap presets.

## Compatibility

| Package | Package version | Angular support | Requires |
|---|---:|---|---|
| `@ng-simplicity/forms-bootstrap` | `1.1.4` | `17.x`–`22.x` | `@ng-simplicity/forms-core ^1.1.4` |

Requires `@ng-simplicity/forms-core` `^1.1.4`. From 1.1.2 every package declares `uuid` as a dependency, so it no longer needs to be installed separately.

---

## Installation

Ensure that you have `bootstrap` installed and imported in your application styles, along with the core forms package:

```bash
npm install @ng-simplicity/forms-core @ng-simplicity/forms-bootstrap bootstrap
```

Make sure to include Bootstrap's CSS inside your `angular.json` styles or `index.scss`:
```scss
@import "bootstrap/scss/bootstrap";
```

---

## Quick Start & Registration

To render Bootstrap form elements dynamically, follow these steps:
1. Provide the `NgsFormsService` at the component level to isolate the form state.
2. Register the Bootstrap components in your component constructor using `NgsFormsBootstrapModule.registerAllBootStrapComponents(registry)`.
3. Construct the layout schema (`NgsFormsFormConfig`) using Bootstrap controls.
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
  NgsFormsBootstrapModule,
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormsItemTextAreaComponent
} from '@ng-simplicity/forms-bootstrap';

@Component({
  selector: 'app-bootstrap-form-page',
  standalone: true,
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  template: `
    <div class="container mt-4">
      <h2>Bootstrap Dynamic Form</h2>
      <ngs-form></ngs-form>
      <button class="btn btn-primary" (click)="onSubmit()">Submit</button>
    </div>
  `
})
export class BootstrapFormPageComponent implements OnInit {
  private ngsFormsService = inject(NgsFormsService);

  constructor(registry: NgsFormsComponentRegistryService) {
    // Registers input-text, input-textarea, row, column, checkbox, radio, and other components
    NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
  }

  ngOnInit() {
    // Construct the form configuration
    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 150,
      root: NgsFormsFormGroupComponent.create({
        name: 'profileForm',
        items: [
          NgsFormsRowComponent.create({
            items: [
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'username',
                label: 'Username',
                placeholder: 'Enter username...',
                type: 'text',
                labelLocation: 'top',
                validators: [Validators.required],
                errorMessageMap: {
                  required: 'Username is required.'
                }
              }),
              NgsFormsBootstrapFormsItemTextAreaComponent.create({
                name: 'bio',
                label: 'Biography',
                placeholder: 'Write a short bio...',
                labelLocation: 'left',
                inputCssClass: 'shadow-sm'
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
    if (!this.ngsFormsService.isValid) {
      this.ngsFormsService.setIsSubmitted(true); // Triggers visual error styling
      return;
    }
    console.log('Form data submitted:', this.ngsFormsService.formValue);
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

Here is the full list of available Bootstrap components along with code examples showing their required and optional configuration parameters:

### 1. Text Input (`input-text`)
Uses `NgsFormsBootstrapFormItemInputComponent`.
- **Key**: `input-text`
- **Config Type**: `NgsFormsFormItemConfigBootstrapTextInput`

```typescript
import { NgsFormsBootstrapFormItemInputComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const usernameField = NgsFormsBootstrapFormItemInputComponent.create({
  // Required Parameters
  name: 'username',
  label: 'Username',

  // Optional Parameters
  id: 'custom-username-id',
  placeholder: 'Enter username...',
  type: 'text', // 'text' | 'email' | 'password'
  value: 'default_user', // Initial value
  labelLocation: 'top', // 'top' | 'left' (default is 'top')
  disabled: false,
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Username is required.'
  }
});
```

### 2. Text Area (`input-textarea`)
Uses `NgsFormsBootstrapFormsItemTextAreaComponent`.
- **Key**: `input-textarea`
- **Config Type**: `NgsFormsFormItemConfigBootstrapTextArea`

```typescript
import { NgsFormsBootstrapFormsItemTextAreaComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const bioField = NgsFormsBootstrapFormsItemTextAreaComponent.create({
  // Required Parameters
  name: 'bio',
  label: 'Biography',

  // Optional Parameters
  id: 'custom-bio-id',
  placeholder: 'Tell us about yourself...',
  value: '',
  labelLocation: 'left', // 'top' | 'left' (default is 'top')
  inputCssClass: 'shadow-sm', // Custom css classes applied to textarea
  disabled: false,
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Biography is required.'
  }
});
```

### 3. Checkbox (`checkbox`)
Uses `NgsFormsBootstrapFormsItemCheckboxComponent`.
- **Key**: `checkbox`
- **Config Type**: `NgsFormsFormItemConfigBootstrapCheckbox`

```typescript
import { NgsFormsBootstrapFormsItemCheckboxComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const acceptTermsField = NgsFormsBootstrapFormsItemCheckboxComponent.create({
  // Required Parameters
  name: 'agreeTerms',
  label: 'I accept the terms and conditions',

  // Optional Parameters
  id: 'terms-checkbox-id',
  value: false, // Initial checked state
  disabled: false,
  validators: [Validators.requiredTrue],
  errorMessageMap: {
    required: 'You must check this box to agree.'
  }
});
```

### 4. Select Dropdown (`select`)
Uses `NgsFormsBootstrapFormItemSelectInputComponent`.
- **Key**: `select`
- **Config Type**: `NgsFormsFormItemConfigBootstrapSelectInput`

```typescript
import { NgsFormsBootstrapFormItemSelectInputComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const countrySelectField = NgsFormsBootstrapFormItemSelectInputComponent.create({
  // Required Parameters
  name: 'country',
  label: 'Country',

  // Optional Parameters
  id: 'country-select-id',
  placeholder: 'Select country', // Text displayed for the placeholder option
  placeHolderValue: '', // Custom value for placeholder selection
  value: 'us', // Initial selected option ID
  labelLocation: 'top', // 'top' | 'left' (default is 'top')
  disabled: false,
  options: [
    { id: 'us', label: 'United States' },
    { id: 'ca', label: 'Canada', disabled: false },
    { id: 'mx', label: 'Mexico', disabled: true }
  ],
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Please select a country.'
  }
});
```

### 5. Radio Buttons (`radio`)
Uses `NgsFormsBootstrapRadioInputComponent`.
- **Key**: `radio`
- **Config Type**: `NgsFormsFormsItemConfigBoostrapRadio`

```typescript
import { NgsFormsBootstrapRadioInputComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const notificationPrefField = NgsFormsBootstrapRadioInputComponent.create({
  // Required Parameters
  name: 'notificationPreference',
  label: 'Preferred notifications',

  // Optional Parameters
  id: 'notification-pref-id',
  value: 'email', // Initial selected radio option ID
  alignment: 'horizontal', // 'horizontal' | 'vertical' (default is 'vertical')
  disabled: false,
  options: [
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS / Text Message' },
    { id: 'none', label: 'None' }
  ],
  validators: [Validators.required],
  errorMessageMap: {
    required: 'Please select a contact method.'
  }
});
```

### 6. Toggle Switch (`toggle`)
Uses `NgsFormsBootstrapFormItemToggleComponent`. Value: `true` / `false`.

```typescript
const updatesField = NgsFormsBootstrapFormItemToggleComponent.create({
  name: 'productUpdates',
  label: 'Send me product updates',
  value: false,
});
```

### 7. Button Group (`button-group`)
Uses `NgsFormsBootstrapFormItemButtonGroupComponent`. Value: the chosen option `id`, or an array of ids with `multiple: true`.

```typescript
const planField = NgsFormsBootstrapFormItemButtonGroupComponent.create({
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
Uses `NgsFormsBootstrapFormItemRangeComponent`. Value: a number, starting at `min`.

```typescript
const experienceField = NgsFormsBootstrapFormItemRangeComponent.create({
  name: 'experience',
  label: 'Years of Experience',
  min: 0,
  max: 40,
  step: 1,
  valueSuffix: ' yrs', // shown after the value
});
```

### 9. Typeahead (`typeahead`)
Uses `NgsFormsBootstrapFormItemTypeaheadComponent`. The option labels are the suggestions; the value is the text in the input.

```typescript
const cityField = NgsFormsBootstrapFormItemTypeaheadComponent.create({
  name: 'city',
  label: 'City',
  placeholder: 'Start typing a city',
  options: [{ id: 'berlin', label: 'Berlin' }, { id: 'boston', label: 'Boston' }],
  // options$: load suggestions from a server as the user types
});
```

---

## Unit Testing

Run unit tests for this library package using:

```bash
nx test forms-bootstrap
```

To run with coverage enabled:
```bash
nx test forms-bootstrap --codeCoverage
```

---

## Example Applications

Fully functional example applications demonstrating the form engine functionality are located in the [`apps/`](../../apps) folder of this monorepo:
- **`forms-bootstrap-demo`**: Integrates and showcases the `@ng-simplicity/forms-bootstrap` package.
- **`forms-material-demo`**: Integrates and showcases the `@ng-simplicity/forms-material` package.

---

## Support & Contributions

If you have feature suggestions, need a feature to make `@ng-simplicity/forms-bootstrap` work for your project, or encounter any bugs, please log an issue in the GitHub issue tracker.
