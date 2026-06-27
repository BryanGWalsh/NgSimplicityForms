# @ng-simplicity/forms-core

The core engine package for **NG-Simplicity Forms**. This package manages form states, dynamic registry injection, component lifecycle bindings, and structural layout directives (Rows, Columns, Sections, Groups, Arrays). It enables you to construct highly dynamic, complex forms where control properties (such as visibility, enabled/disabled state, select options, and validation rules) reactively adapt in real-time based on the current values inside the form. The engine is highly customizable, allowing you to develop and add your own custom form controls to the registry to be used in the form rendering.

This core package is extended by styling integration packages that provide prebuilt themed form components:
- **[@ng-simplicity/forms-bootstrap](../forms-bootstrap/README.md)**: Dynamic forms pre-styled with Bootstrap form fields and layouts.
- **[@ng-simplicity/forms-material](../forms-material/README.md)**: Dynamic forms pre-styled with Angular Material inputs and controls.

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

### 2. Register, Construct, and Set Form Config

To use the dynamic form in your application:
1. Provide the `NgsFormsService` at the component level (so that each page/form gets its own isolated instance of the form service).
2. Register your custom components with `NgsFormsComponentRegistryService`.
3. Construct your layout configuration (`NgsFormsFormConfig`).
4. Set the configuration on `NgsFormsService`.
5. Include the `<ngs-form></ngs-form>` tag in your component template.

Here is a complete setup:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { 
  NgsFormComponent,
  NgsFormsComponentRegistryService, 
  NgsFormsService, 
  NgsFormsFormConfig, 
  NgsFormsFormGroupComponent 
} from '@ng-simplicity/forms-core';
import { CustomFancyInputComponent } from './custom-fancy-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  template: `
    <div class="form-container">
      <h2>Profile Settings</h2>
      <ngs-form></ngs-form>
      <button (click)="onSubmit()">Submit</button>
    </div>
  `
})
export class AppComponent implements OnInit {
  private ngsFormsService = inject(NgsFormsService);

  constructor(registry: NgsFormsComponentRegistryService) {
    // Register your custom components with the dynamic engine
    registry.register(CustomFancyInputComponent.key, CustomFancyInputComponent);
  }

  ngOnInit() {
    // Construct the schema configuration
    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 100,
      root: NgsFormsFormGroupComponent.create({
        name: 'profileForm',
        items: [
          CustomFancyInputComponent.create({
            name: 'nickname',
            label: 'Nickname',
            placeholder: 'Enter cool nickname...',
            customColor: 'purple',
            validators: [Validators.required, Validators.minLength(3)],
            errorMessageMap: {
              required: 'Nickname is required.',
              minlength: 'Nickname must be at least 3 characters.'
            }
          })
        ]
      })
    };

    // Set the configuration to initialize the form control tree
    this.ngsFormsService.setFormConfig(formConfig);
  }

  onSubmit() {
    if (this.ngsFormsService.isValid) {
      console.log('Form Submitted!', this.ngsFormsService.formValue);
    } else {
      this.ngsFormsService.setIsSubmitted(true); // Triggers error validation display
    }
  }
}
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

## Common Control Properties

Most controls and layout structures support a standard set of core properties that are managed by the dynamic forms engine. These properties allow passing either a static/basic value or an asynchronous stream (`Observable`):

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

## Dynamic Form Arrays (`form-array`)

Form Arrays in `@ng-simplicity/forms-core` allow for dynamic lists of repeating items (such as adding multiple emergency contacts or addresses). Managing form arrays requires three distinct components working in harmony:

1. **`NgsFormsFormArrayContainerComponent` (Container)**: 
   - Manages the outer `FormArray` control and acts as the shell.
   - Requires setting `name` (the control name), `initialItemCount` (minimum display elements), and boundaries (`minItems`, `maxItems`).
2. **`NgsFormsFormArrayListComponent` (Repeater)**:
   - Resides inside the `items` array of the container.
   - Defines a `templateItem` property containing the layout / controls to clone for each dynamic item.
   - **Crucial Pattern**: The `templateItem` should wrap the inputs inside a layout structure (like a `form-row` or `column`). The engine will dynamically register these repeated fields inside a dedicated `FormGroup` *per array item* under the hood (e.g. `contacts: [{ name: '', phone: '' }]`), isolating the control states.
3. **Array Mutation Buttons (`form-array-add-item` / `form-array-remove-item`)**:
   - `NgsFormsFormArrayAddItemComponent`: Placed inside the container's items array (outside the repeater component) to trigger appending a new form group cloned from the `templateItem`.
   - `NgsFormsFormArrayRemoveItemComponent`: Placed inside the `templateItem` template (next to the form inputs) so each item row contains a button to delete itself.

### Example Schema Configuration

Here is a complete setup illustrating how these components work together:

```typescript
import {
  NgsFormsFormArrayContainerComponent,
  NgsFormsFormArrayListComponent,
  NgsFormsRowComponent,
  NgsFormsFormArrayRemoveItemComponent,
  NgsFormsFormArrayAddItemComponent
} from '@ng-simplicity/forms-core';

const contactArray = NgsFormsFormArrayContainerComponent.create({
  name: 'contacts',
  initialItemCount: 1,
  minItems: 1,
  maxItems: 3,
  containerClass: 'contacts-container',
  itemContainerClass: 'contact-row-card',
  items: [
    // 1. The Repeater Component containing the repeated schema structure
    NgsFormsFormArrayListComponent.create({
      templateItem: NgsFormsRowComponent.create({
        containerClass: 'row align-items-center',
        items: [
          // Input fields per array item
          SomeInputComponent.create({
            name: 'contactName',
            label: 'Contact Name',
            validators: [Validators.required]
          }),
          SomeInputComponent.create({
            name: 'contactPhone',
            label: 'Phone Number',
            validators: [Validators.required]
          }),
          // 2. The Remove Button placed inside the templateItem row to delete this specific row
          NgsFormsFormArrayRemoveItemComponent.create({
            buttonText: 'Remove',
            buttonClass: 'btn btn-danger'
          })
        ]
      })
    }),
    
    // 3. The Add Button placed outside the repeater but inside the container to append rows
    NgsFormsRowComponent.create({
      items: [
        NgsFormsFormArrayAddItemComponent.create({
          buttonText: 'Add Additional Contact',
          buttonClass: 'btn btn-primary'
        })
      ]
    })
  ]
});
```

---

## Core Layout & Structural Components

`@ng-simplicity/forms-core` provides all non-styling-specific components and layout containers. Here is the list of available core components and how to construct them:

### 1. Form Group (`form-group`)
Creates a nested `FormGroup` control.
- **Component**: `NgsFormsFormGroupComponent`
- **Key**: `'form-group'`
- **Config Type**: `NgsFormsFormItemConfigBaseItemWithNameAndValidators`

```typescript
import { NgsFormsFormGroupComponent } from '@ng-simplicity/forms-core';

const group = NgsFormsFormGroupComponent.create({
  name: 'profileDetails',
  disabled: false,
  items: [
    // Array of child NgsFormsFormItem<any> components
  ]
});
```

### 2. Form Array Container (`form-array`)
Creates a dynamic `FormArray` containing a list of repeated controls/groups.
- **Component**: `NgsFormsFormArrayContainerComponent`
- **Key**: `'form-array'`
- **Config Type**: `NgsFormItemArrayConfig`

```typescript
import { NgsFormsFormArrayContainerComponent } from '@ng-simplicity/forms-core';

const contactList = NgsFormsFormArrayContainerComponent.create({
  name: 'contacts',
  initialItemCount: 1, // Number of items shown initially
  minItems: 1, // Minimum allowed items
  maxItems: 5, // Maximum allowed items
  containerClass: 'custom-array-class', // CSS class for array container
  itemContainerClass: 'custom-array-item-class', // CSS class for each item container
  items: [
    // Template items to replicate (e.g. input-text controls followed by a form-array-remove-button)
  ]
});
```

### 3. Form Array Add Item Button (`form-array-add-item`)
Button to dynamically append a new item into the parent FormArray.
- **Component**: `NgsFormsFormArrayAddItemComponent`
- **Key**: `'form-array-add-item'`
- **Config Type**: `NgsFormItemArrayAddItemConfig`

```typescript
import { NgsFormsFormArrayAddItemComponent } from '@ng-simplicity/forms-core';

const addContactBtn = NgsFormsFormArrayAddItemComponent.create({
  buttonText: 'Add Contact',
  buttonClass: 'btn btn-success',
  buttonIcon: 'plus-icon'
});
```

### 4. Form Array Remove Item Button (`form-array-remove-item`)
Button to dynamically remove the current item from the parent FormArray.
- **Component**: `NgsFormsFormArrayRemoveItemComponent`
- **Key**: `'form-array-remove-item'`
- **Config Type**: `NgsFormItemArrayRemoveItemConfig`

```typescript
import { NgsFormsFormArrayRemoveItemComponent } from '@ng-simplicity/forms-core';

const removeContactBtn = NgsFormsFormArrayRemoveItemComponent.create({
  buttonText: 'Delete',
  buttonClass: 'btn btn-danger',
  buttonIcon: 'trash-icon'
});
```

### 5. Section (`section`)
A visual layout grouping with a title and subtitle.
- **Component**: `NgsFormsFormSectionComponent`
- **Key**: `'section'`
- **Config Type**: `NgsFormsFormSectionConfig`

```typescript
import { NgsFormsFormSectionComponent } from '@ng-simplicity/forms-core';

const personalSection = NgsFormsFormSectionComponent.create({
  title: 'Personal Information',
  titleClass: 'custom-title-class', // Optional, defaults to 'h3'
  subtitle: 'Tell us a bit about yourself',
  subtitleClass: 'custom-subtitle-class', // Optional, defaults to 'lead'
  items: [
    // Array of child NgsFormsFormItem<any> components
  ]
});
```

### 6. Row Layout (`form-row`)
Arranges child elements in a flex grid row.
- **Component**: `NgsFormsRowComponent`
- **Key**: `'form-row'`
- **Config Type**: `NgsFormItemRowConfig`

```typescript
import { NgsFormsRowComponent } from '@ng-simplicity/forms-core';

const flexRow = NgsFormsRowComponent.create({
  containerClass: 'row g-3', // CSS class for row container
  columnClass: 'col-md-6', // CSS class applied to ALL child columns (optional)
  columnClasses: ['col-md-8', 'col-md-4'], // CSS classes applied to each column individually (optional)
  items: [
    // Array of child NgsFormsFormItem<any> components
  ]
});
```

### 7. Column Layout (`column`)
Groups elements vertically inside a layout.
- **Component**: `NgsFormsColumnComponent`
- **Key**: `'column'`
- **Config Type**: `NgsFormsFormItemContainerConfigBase`

```typescript
import { NgsFormsColumnComponent } from '@ng-simplicity/forms-core';

const layoutCol = NgsFormsColumnComponent.create({
  items: [
    // Array of child NgsFormsFormItem<any> components
  ]
});
```

### 8. HTML Content (`content-html`)
Inserts static HTML blocks directly into the layout.
- **Component**: `NgsFormsHtmlContentComponent`
- **Key**: `'content-html'`
- **Config Type**: `NgsFormItemHtmlContentConfig`

```typescript
import { NgsFormsHtmlContentComponent } from '@ng-simplicity/forms-core';

const disclaimerText = NgsFormsHtmlContentComponent.create({
  html: '<p class="text-muted">By clicking register, you agree to our policies.</p>',
  sanitize: true // Whether to run sanitizer on the html
});
```

### 9. Text Div (`text-div`)
Inserts a basic text div.
- **Component**: `NgsFormsTextDivComponent`
- **Key**: `'text-div'`
- **Config Type**: `NgsFormsTextDivConfig`

```typescript
import { NgsFormsTextDivComponent } from '@ng-simplicity/forms-core';

const headerText = NgsFormsTextDivComponent.create({
  text: 'Billing Details',
  classes: 'fw-bold mb-2' // CSS class name for styling
});
```

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

*   **`NgsFormsFormItemConfigBase`**: Standard base structure containing optional `uuid?: string`, `visible?: boolean`, `visible$?: Observable<boolean>`, and `initialState?: any`.
*   **`NgsFormsFormItemConfigBaseItemWithNameAndValidators`**: Core interface for registerable form controls. Adds `name: string`, `errorMessageMap?: NgsFormsFormErrorKeyValueMap`, `disabled?`/`disabled$?`, and `validators?`/`validators$?`.
*   **`NgsFormsFormGroupConfig`**: Extends both the name/validators base and the items container base. Used for FormGroup configurations.
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

---

## Example Applications

Fully functional example applications demonstrating the form engine functionality are located in the [`apps/`](../../apps) folder of this monorepo:
- **`forms-bootstrap-demo`**: Integrates and showcases the `@ng-simplicity/forms-bootstrap` package.
- **`forms-material-demo`**: Integrates and showcases the `@ng-simplicity/forms-material` package.

---

## Support & Contributions

If you have feature suggestions, need a feature to make `@ng-simplicity/forms-core` work for your project, or encounter any bugs, please log an issue in the GitHub issue tracker.
