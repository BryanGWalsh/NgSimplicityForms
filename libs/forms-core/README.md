# @ng-simplicity/forms-core

The core engine package for **NG-Simplicity Forms**. This package manages form states, dynamic registry injection, component lifecycle bindings, and structural layout directives (Rows, Columns, Sections, Groups, Arrays).

---

## Installation

Add this package to your Angular application:

```bash
npm install @ng-simplicity/forms-core
```

---

## Architecture Overview

`@ng-simplicity/forms-core` is structured around three primary layers:

### 1. The Public Boundary: `NgsFormsService`
- Injected by the user's component page.
- Exposes form values and statuses through Signals and observables (e.g. `formValue$`, `dirty`, `isValid`).
- Provides entry methods like `setFormConfig(config)` and `patchValue(data)`.
- Implements a retry loading mechanism in case child elements compile asynchronously.

### 2. The Internal Coordinator: `NgsFormsInternalService`
- Provided at the container level by `<ngs-form>`.
- Coordinates component states, validators, and submission attempts.
- Offers `subscribeToState(fieldName)` to merge local field configurations with global properties.

### 3. Component Registry: `NgsFormsComponentRegistryService`
- Maps string identifiers (like `input-text`, `input-textarea`) to actual Angular component types.
- Used by the rendering compiler to dynamically construct layout structures.

---

## Custom Component Development Guide

One of the main strengths of `forms-core` is the ability to write your own custom inputs and register them. To build a custom component that hooks into the dynamic forms layout:

### 1. Extend `NgsFormsFormItemWithVisibleAndValidatorsBase`

Your component must extend the base class and use Angular's Reactive Forms control bindings.

```typescript
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgsFormsFormItemWithVisibleAndValidatorsBase,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseTextInput
} from '@ng-simplicity/forms-core';
import { CommonModule } from '@angular/common';
import { v4 } from 'uuid';

export interface CustomInputConfig extends NgsFormsFormItemConfigBaseTextInput {
  customColor?: string;
}

@Component({
  selector: 'custom-fancy-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (control) {
      <div class="fancy-input-wrapper">
        <label [style.color]="config.customColor">{{ config.label }}</label>
        <input 
          [formControl]="control" 
          [placeholder]="config.placeholder || ''" 
          class="fancy-input-field"
        />
        @if (errorMessage) {
          <div class="error-msg">{{ errorMessage }}</div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFancyInputComponent 
  extends NgsFormsFormItemWithVisibleAndValidatorsBase<CustomInputConfig> 
  implements OnInit 
{
  static override key = 'fancy-input';

  // Helper static creator to ensure type-safe schema composition
  static create(config: CustomInputConfig): NgsFormsFormItem<CustomInputConfig> {
    return {
      uuid: v4(),
      type: CustomFancyInputComponent.key,
      config,
    };
  }
}
```

### 2. Register Your Component

Register it into the registry service:

```typescript
import { Component } from '@angular/core';
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { CustomFancyInputComponent } from './custom-fancy-input.component';

@Component({
  selector: 'app-root',
  template: '<ngs-form></ngs-form>'
})
export class AppComponent {
  constructor(registry: NgsFormsComponentRegistryService) {
    registry.register(CustomFancyInputComponent.key, CustomFancyInputComponent);
  }
}
```

### 3. Add to Schema

```typescript
const formConfig = {
  inputUpdateDebounce: 100,
  root: NgsFormsFormGroupComponent.create({ name: 'profileForm' }, [
    CustomFancyInputComponent.create({
      name: 'nickname',
      label: 'Nickname',
      placeholder: 'Enter cool nickname...',
      customColor: 'purple'
    })
  ])
};
```

---

## Validation & Error Messages (`errorMessageMap`)

Each form control component that extends `NgsFormsFormItemWithVisibleAndValidatorsBase` gets access to validation handling out of the box. 

1. **Defining Validation Rules**: When creating your configuration schema, pass validators (such as `Validators.required` or custom functions) under `validators` or as an observable stream under `validators$`.
2. **Customizing Error Messages**: Pass an optional `errorMessageMap` object containing key-value pairs matching Angular validator error codes to custom text:
   ```typescript
   errorMessageMap: {
     required: 'This field cannot be left blank.',
     minlength: 'Must be at least 4 characters long.',
     email: 'Please enter a valid email address.'
   }
   ```
3. **Displaying Errors**: Within your custom component template, bind your error display element to the `errorMessage` property inherited from the base class. The core engine dynamically updates `errorMessage` based on whether the control is invalid, touched, dirty, or if the form has been submitted.

---

## Extension Reference Guide

When writing custom controls, select the appropriate base class and configuration interface to inherit from.

### Available Base Classes
All base classes are exported from `@ng-simplicity/forms-core`:

*   **`NgsFormsBaseClassFormComponent<T>`**: The fundamental base class. Automatically fetches and injects the component's static configuration (`config`).
*   **`NgsFormsFormItemWithVisibleAndValidatorsBase<T>`**: Extends the base form component class. Connects the component to the parent `FormGroup` or `FormArray`, listens to visibility state (`visible$`), sets up control validator bindings (`validators`/`validators$`), and manages active `errorMessage` and `submitted` states.
*   **`NgsFormsBaseClassFormInputComponent<T>`**: Extends the validator base class. Exposes a `commonState` signal that listens to merged global state or local state overrides (useful for context properties like theme settings or read-only/interactive display toggles).
*   **`NgsFormsBaseClassFormItemInputWithOptionsComponent<T>`**: Extends the input base class. Specifically designed for controls with choice selection (dropdowns, lists, radio button groups). Exposes a unified `options` signal mapped from either static arrays or dynamic observable streams (`options$`).
*   **`NgsFormsBaseClassItemsContainerBase<T>`**: The base class used for layout containers (like rows, grids, sections, groups) that recursively render a nested set of child form components.

### Available Configuration Interfaces
Ensure your custom configuration type extends one of these core interfaces for full TypeScript safety:

*   **`NgsFormsFormItemConfigBase`**: Standard base structure containing only an optional `uuid?: string`.
*   **`NgsFormsFormItemConfigBaseItemWithNameAndValidators`**: Core interface for registerable form controls. Adds `name: string`, `errorMessageMap?: NgsFormsFormErrorKeyValueMap`, `disabled?`/`disabled$?`, and `validators?`/`validators$?`.
*   **`NgsFormsFormItemConfigBaseInput`**: Extends the name/validators base. Adds common interactive input properties: `id?: string`, `label: string`, and `value?: unknown`.
*   **`NgsFormsFormItemConfigBaseTextInput`**: Extends the input base. Adds text-specific options: `placeholder?: string` and `type?: 'text' | 'email' | 'password'`.
*   **`NgsFormsFormItemConfigBaseInputWithOptions`**: Extends the input base. Adds selection fields: `options?: Array<NgsFormsFormInputOption>` and `options$?: Observable<Array<NgsFormsFormInputOption>>`.
*   **`NgsFormsFormItemContainerConfigBase`**: Extends the base interface. Used by layout components, defining an array of children: `items: Array<NgsFormsFormItem<any>>`.

---

## Commands

- **Run unit tests**:
  ```bash
  nx test forms-core
  ```
- **Run test with code coverage**:
  ```bash
  nx test forms-core --codeCoverage
  ```
