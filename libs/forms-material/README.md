# @ng-simplicity/forms-material

An integration package containing pre-styled Angular Material inputs, form fields, and error templates for the **NG-Simplicity Forms** dynamic engine.

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

To allow the dynamic compiler to render Material fields, register them using `NgsFormsMaterialModule` inside your page component:

```typescript
import { Component } from '@angular/core';
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialModule } from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-material-form-page',
  templateUrl: './material-form-page.component.html'
})
export class MaterialFormPageComponent {
  constructor(registry: NgsFormsComponentRegistryService) {
    // Registers Material inputs, textareas, layouts, and helpers
    NgsFormsMaterialModule.registerAllMaterialComponents(registry);
  }
}
```

---

## Available Components & Schemas

### 1. Material Text Input (`input-text`)
Uses `NgsFormsMaterialFormItemInputComponent`.

- **Selector/Key**: `input-text`
- **Config Type**: Object containing `name`, `label`, `placeholder`, `type`.
- **Features**: Leverages `<mat-form-field>` appearance="outline", supports `<mat-error>` validation hooks, and custom HTML input types (`email`, `password`, `text`).

```typescript
import { NgsFormsMaterialFormItemInputComponent } from '@ng-simplicity/forms-material';
import { Validators } from '@angular/forms';

const passwordField = NgsFormsMaterialFormItemInputComponent.create({
  name: 'password',
  label: 'Password',
  placeholder: 'Type password...',
  type: 'password',
  validators: [Validators.required, Validators.minLength(8)]
});
```

### 2. Material Text Area (`input-textarea`)
Uses `NgsFormsMaterialFormItemTextAreaComponent`.

- **Selector/Key**: `input-textarea`
- **Config Type**: Object containing `name`, `label`, `placeholder`, `rows`.
- **Features**: Outlined MatFormField container housing a multi-line auto-resizing text area.

```typescript
import { NgsFormsMaterialFormItemTextAreaComponent } from '@ng-simplicity/forms-material';

const messageField = NgsFormsMaterialFormItemTextAreaComponent.create({
  name: 'comments',
  label: 'Additional Comments',
  placeholder: 'Leave a note...',
  rows: 4
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
