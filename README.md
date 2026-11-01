# NG-Simplicity Forms

[![Active Development](https://img.shields.io/badge/Status-Active%20Development-orange.svg)](#)
[![Angular Support](https://img.shields.io/badge/Angular-17--22.x-red.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Documentation](https://img.shields.io/badge/Docs-ng--simplicity--forms.bryangwalsh.com-4f46e5.svg)](https://ng-simplicity-forms.bryangwalsh.com)

📖 **Documentation, tutorials and live demos:** [ng-simplicity-forms.bryangwalsh.com](https://ng-simplicity-forms.bryangwalsh.com) · [Getting started](https://ng-simplicity-forms.bryangwalsh.com/getting-started/introduction) · [API reference](https://ng-simplicity-forms.bryangwalsh.com/api)

## Compatibility

All four packages are currently at version `1.1.2` and support Angular `17.x` through `22.x`. Angular 17 is the minimum because the templates use built-in control flow (`@if` and `@for`); Signals alone would allow an Angular 16 floor, but the template syntax does not.

| Package | Package version | Angular support | Additional peer requirement |
|---|---:|---|---|
| `@ng-simplicity/forms-core` | `1.1.2` | `17.x`–`22.x` | — |
| `@ng-simplicity/forms-bootstrap` | `1.1.2` | `17.x`–`22.x` | `@ng-simplicity/forms-core ^1.1.2` |
| `@ng-simplicity/forms-material` | `1.1.2` | `17.x`–`22.x` | `@angular/material` `17.x`–`22.x` and `@ng-simplicity/forms-core ^1.1.2` |
| `@ng-simplicity/forms-tailwind` | `1.1.2` | `17.x`–`22.x` | `@ng-simplicity/forms-core ^1.1.2` and Tailwind CSS (v4 recommended, v3 works) in your build |

Use Angular Material from the same major as Angular. Its peer dependencies must also include the corresponding Angular major, so the Material package accepts Material majors 17 through 22.

The shared package versions let a compatible fix be released once and used by applications on any supported Angular major. For example, a fix released as `1.1.1` can be installed by applications using Angular 17, 20, or 22 without separate Angular-specific package releases. The current packages are post-1.0, so compatible fixes can use patch releases. Before 1.0, npm caret ranges are narrower: `^0.1.0` stops before `0.2.0`, so consumers would not receive a fix published as `0.2.0` without changing their declared range.


**NG-Simplicity Forms** is an ecosystem of Angular packages designed to dynamically generate forms from rich configuration schemas. Built from the ground up to support modern Angular design paradigms, the library focuses heavily on **Signals-based state management**, **OnPush change detection**, and full compatibility with **Zoneless** applications.

It enables you to construct highly dynamic, complex forms where control properties (such as visibility, enabled/disabled state, select options, and validation rules) reactively adapt in real-time based on the current values inside the form.

By separating the form logic and state coordinator from the UI styling layout components, the engine supports multiple styling frameworks as extensions of the core engine, using the same declarative form configurations. The ecosystem is also highly customizable, allowing you to develop and add your own custom form controls to the registry to be used in the form rendering.

---

## Workspace Architecture & Packages

This library is organized as an Nx workspace consisting of three primary packages:

| Package | Directory / README | Description |
|---|---|---|
| **`@ng-simplicity/forms-core`** | [`libs/forms-core`](./libs/forms-core/README.md) | Core form engine containing the reactive service API, dynamic component registry, models, base classes, and structural components (Column, Row, Section, Form Group, etc.). |
| **`@ng-simplicity/forms-bootstrap`** | [`libs/forms-bootstrap`](./libs/forms-bootstrap/README.md) | Bootstrap-themed implementation of the core components (e.g. text inputs, textareas) pre-styled for Bootstrap layouts. |
| **`@ng-simplicity/forms-material`** | [`libs/forms-material`](./libs/forms-material/README.md) | Angular Material-themed implementation of the core components. |
| **`@ng-simplicity/forms-tailwind`** | [`libs/forms-tailwind`](./libs/forms-tailwind/README.md) | Tailwind CSS-styled implementation of the core components, with every class overridable through a provider. |

### Documentation Site
Guides, tutorials with live demos, and a generated API reference are published at **[ng-simplicity-forms.bryangwalsh.com](https://ng-simplicity-forms.bryangwalsh.com)**. The site's source lives in [`apps/docs`](./apps/docs). Run it locally with `npm run serve-docs`. It is deployed to GitHub Pages by [`.github/workflows/docs.yml`](./.github/workflows/docs.yml); see the site's "Contributing to the docs" page for setup.

### Example Applications
Fully functional example applications demonstrating the form engine functionality are located in the [`apps/`](./apps) folder of this monorepo:
- **`forms-bootstrap-demo`**: Integrates and showcases the `@ng-simplicity/forms-bootstrap` package.
- **`forms-material-demo`**: Integrates and showcases the `@ng-simplicity/forms-material` package.

---

## Core Features

- **Declarative Form Config**: Define your entire form hierarchy (including conditional structures, options, validators, and custom state) using strongly typed configurations.
- **Signals & OnPush-First**: Seamlessly translates Reactive Form observables (`valueChanges`, submit status, validity) into Angular Signals for high-performance, lag-free UI updates.
- **Zoneless Ready**: Built strictly with modern APIs (`toSignal`, rxjs-interop) making it completely compatible with zoneless environments.
- **Framework Separation**: Swap or mix UI styling libraries (Bootstrap, Material or Tailwind) by switching components in the registry, without rewriting form logic.
- **Dynamic Visibility & Validators**: Bind fields' visibility and validators to dynamic streams (`Observable` / `BehaviorSubject`) for fully reactive forms that adapt to user input on the fly.
- **State Merging**: Automatically merges global form states with local component overrides, offering granular component customization.

---

## Quick Start Guide

### 1. Register Styling Components

Inject the `NgsFormsComponentRegistryService` and register the theme components of your choice in your root or page component constructor.

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialModule } from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-my-form-page',
  templateUrl: './my-form-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFormPageComponent {
  constructor(registry: NgsFormsComponentRegistryService) {
    // Registers dynamic components (e.g., input-text, input-textarea) for Material
    NgsFormsMaterialModule.registerAllMaterialComponents(registry);
  }
}
```

### 2. Declare Form Configurations & Inject the Service

Provide `NgsFormsService` at the component level to initialize a dedicated form state boundary. Create your form schema using the static `.create()` helper methods on the theme components.

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgsFormsFormConfig, NgsFormsService, NgsFormsFormGroupComponent } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialFormItemInputComponent } from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-my-form-page',
  templateUrl: './my-form-page.component.html',
  providers: [NgsFormsService], // Scopes form state to this component lifecycle
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFormPageComponent implements OnInit {
  private readonly ngsFormsService = inject(NgsFormsService);

  ngOnInit() {
    const formConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 150,
      globalState: {
        theme: 'dark'
      },
      root: NgsFormsFormGroupComponent.create({
        name: 'registrationForm',
        items: [
          NgsFormsMaterialFormItemInputComponent.create({
            name: 'username',
            label: 'Username',
            placeholder: 'Choose a username',
            type: 'text',
            validators: [Validators.required, Validators.minLength(4)]
          }),
          NgsFormsMaterialFormItemInputComponent.create({
            name: 'email',
            label: 'Email Address',
            placeholder: 'user@example.com',
            type: 'email',
            validators: [Validators.required, Validators.email]
          })
        ]
      })
    };

    // Feed configuration to the form engine
    this.ngsFormsService.setFormConfig(formConfig);
  }
}
```

### 3. Read Values using Angular Signals

Use the `toSignal()` utility to convert form states into signals, keeping your component code free of manual RxJS subscription management.

```typescript
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgsFormsService } from '@ng-simplicity/forms-core';

@Component({
  selector: 'app-my-form-page',
  templateUrl: './my-form-page.component.html',
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFormPageComponent {
  readonly ngsFormsService = inject(NgsFormsService);

  // Derive signals directly from the service
  readonly formValue = toSignal(this.ngsFormsService.formValue$);

  // Use component getters to reactively read service getter properties
  get isValid(): boolean {
    return this.ngsFormsService.isValid;
  }

  get isDirty(): boolean {
    return this.ngsFormsService.dirty;
  }
}
```

### 4. Render the Dynamic Form in HTML

Use the `<ngs-form>` element. The engine takes care of checking if the component registration and core services are active, and dynamically renders the child elements.

```html
<div class="form-container">
  <h2>Register</h2>
  
  <!-- Dynamic Form Renderer -->
  <ngs-form></ngs-form>

  <div class="form-actions mt-3">
    <!-- Read standard getter properties -->
    <button mat-raised-button color="primary" [disabled]="!isValid">Submit</button>
  </div>
  
  <div class="debug-panel mt-4">
    <h4>Form Data (Reactive Signal):</h4>
    <pre>{{ formValue() | json }}</pre>
  </div>
</div>
```

---

## Creating Custom UI Components (e.g. using Tailwind CSS)

You can build a custom set of form components using any styling library (such as Tailwind CSS) by subclassing the core base classes and registering them with `NgsFormsComponentRegistryService`.

### 1. Extend the Configuration Interface

Create a config interface that inherits from the core text input config base `NgsFormsFormItemConfigBaseInput`:

```typescript
import { NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';

export interface TailwindInputConfig extends NgsFormsFormItemConfigBaseInput {
  placeholder?: string;
  darkMode?: boolean;
}
```

### 2. Implement the Tailwind Component Class

Inherit your component from `NgsFormsBaseClassFormInputComponent` (which gives you access to the reactive FormControl, validator bindings, and common states like dynamic visibility):

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { TailwindInputConfig } from './tailwind-input.config';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tailwind-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tailwind-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TailwindInputComponent extends NgsFormsBaseClassFormInputComponent<TailwindInputConfig> {
  static override key = 'tailwind-input';

  static create(config: TailwindInputConfig): NgsFormsFormItem<TailwindInputConfig> {
    return {
      uuid: uuidv4(),
      type: TailwindInputComponent.key,
      config,
    };
  }
}
```

### 3. Create the HTML View using Tailwind Utility Classes

```html
<div *ngIf="control" class="mb-4">
  <label class="block text-sm font-semibold mb-2" [class.text-red-500]="!!errorMessage">
    {{ config.label }}
  </label>
  <input
    [formControl]="control"
    [placeholder]="config.placeholder || ''"
    [type]="config.type || 'text'"
    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
    [class.border-red-500]="!!errorMessage"
    [class.focus:ring-red-200]="!!errorMessage"
    [class.border-gray-300]="!errorMessage"
    [class.focus:ring-blue-200]="!errorMessage"
  />
  <p *ngIf="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</p>
</div>
```

### 4. Register the Custom Component

```typescript
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { TailwindInputComponent } from './tailwind-input.component';

// Inside your main page or root component constructor
constructor(registry: NgsFormsComponentRegistryService) {
  registry.register(TailwindInputComponent.key, TailwindInputComponent);
}
```

---

## Local Development Commands

This monorepo uses Nx to manage building, linting, testing, and serving.

- **Run Bootstrap Demo Application**:
  ```bash
  npm run serve-bootstrap-demo
  ```
- **Run Material Demo Application**:
  ```bash
  npm run serve-material-demo
  ```
- **Build All Library Packages**:
  ```bash
  npm run build:packages
  ```
- **Run All Unit Tests**:
  ```bash
  npm run test:packages
  ```
- **Lint All Library Packages**:
  ```bash
  npm run lint:packages
  ```
- **Dry-run Publish Preparation**:
  ```bash
  npm run publish:dry-run
  ```

---

## License

This project is licensed under the MIT License.
