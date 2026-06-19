# @ng-simplicity/forms-bootstrap

A package containing pre-styled Bootstrap form inputs, containers, and templates for the **NG-Simplicity Forms** dynamic engine.

---

## Installation

Ensure that you have `bootstrap` installed and imported in your application styles, along with the core forms package:

```bash
npm install @ng-simplicity/forms-core @ng-simplicity/forms-bootstrap bootstrap lodash
```

Make sure to include Bootstrap's CSS inside your `angular.json` styles or `index.scss`:
```scss
@import "bootstrap/scss/bootstrap";
```

---

## Quick Start & Registration

To make these styling components available to the dynamic renderer, register them using `NgsFormsBootstrapModule` in your page component constructor:

```typescript
import { Component } from '@angular/core';
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapModule } from '@ng-simplicity/forms-bootstrap';

@Component({
  selector: 'app-bootstrap-form-page',
  templateUrl: './bootstrap-form-page.component.html'
})
export class BootstrapFormPageComponent {
  constructor(registry: NgsFormsComponentRegistryService) {
    // Registers input-text, input-textarea, row, column, and other components
    NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
  }
}
```

---

## Available Components & Schemas

### 1. Text Input (`input-text`)
Uses `NgsFormsBootstrapFormItemInputComponent`.

- **Selector/Key**: `input-text`
- **Config Type**: `NgsFormsFormItemConfigBootstrapTextInput`
- **Features**: Supports label locations (`top` or `left`), validation status borders, invalid feedback, custom types (`text`, `email`, `password`), and placeholder bindings.

```typescript
import { NgsFormsBootstrapFormItemInputComponent } from '@ng-simplicity/forms-bootstrap';
import { Validators } from '@angular/forms';

const usernameField = NgsFormsBootstrapFormItemInputComponent.create({
  name: 'username',
  label: 'Username',
  placeholder: 'Enter username...',
  type: 'text',
  labelLocation: 'top',
  validators: [Validators.required]
});
```

### 2. Text Area (`input-textarea`)
Uses `NgsFormsBootstrapFormsItemTextAreaComponent`.

- **Selector/Key**: `input-textarea`
- **Config Type**: `NgsFormsFormItemConfigBootstrapTextArea`
- **Features**: Supports rows configuration, css classes override, validation classes, label locations, and placeholder bindings.

```typescript
import { NgsFormsBootstrapFormsItemTextAreaComponent } from '@ng-simplicity/forms-bootstrap';

const bioField = NgsFormsBootstrapFormsItemTextAreaComponent.create({
  name: 'bio',
  label: 'About Me',
  placeholder: 'Tell us about yourself...',
  labelLocation: 'left',
  inputCssClass: 'shadow-sm'
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
