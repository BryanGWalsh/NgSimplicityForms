# Quick start: Bootstrap

This page builds a small registration form with the Bootstrap components. It assumes you have followed the [Bootstrap installation steps](/getting-started/installation#with-bootstrap).

::: demo quick-start-bootstrap

## 1. Provide the form service

Every form needs its own `NgsFormsService`. Provide it on the component that will host the form, so the form's state lives and dies with that component.

```ts title=registration.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgsFormComponent, NgsFormsService } from '@ng-simplicity/forms-core';

@Component({
  selector: 'app-registration',
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  private readonly forms = inject(NgsFormsService);
}
```

## 2. Register the Bootstrap components

The engine renders each item by looking up its `type` in `NgsFormsComponentRegistryService`. `registerAllBootStrapComponents()` registers the structural components from the core package and the five Bootstrap inputs.

```ts
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapModule } from '@ng-simplicity/forms-bootstrap';

constructor() {
  NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
}
```

The registry is shared by the whole page, so registering once in your root component also works. Registering again is harmless.

## 3. Render the form

Put `<ngs-form>` where the form should appear. It takes no inputs: it renders whatever configuration the nearest `NgsFormsService` holds.

```html title=registration.component.html
<ngs-form></ngs-form>
<button type="button" class="btn btn-primary" (click)="submit()">Register</button>
```

## 4. Describe the form

Call `setFormConfig()` with the form's configuration. The root is usually a form group, and its `name` becomes the top level key of the form value. Each item is created with the static `create()` helper of the component that renders it.

```ts
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgsFormsFormGroupComponent } from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapFormItemInputComponent } from '@ng-simplicity/forms-bootstrap';

ngOnInit() {
  this.forms.setFormConfig({
    inputUpdateDebounce: 0,
    globalState: {},
    root: NgsFormsFormGroupComponent.create({
      name: 'registration',
      items: [
        NgsFormsBootstrapFormItemInputComponent.create({
          name: 'username',
          label: 'Username',
          validators: [Validators.required, Validators.minLength(4)],
          errorMessageMap: { required: 'Pick a username.', minlength: 'Use at least 4 characters.' },
        }),
        NgsFormsBootstrapFormItemInputComponent.create({
          name: 'email',
          label: 'Email address',
          type: 'email',
          validators: [Validators.required, Validators.email],
          errorMessageMap: { required: 'We need your email address.', email: 'That does not look like an email address.' },
        }),
      ],
    }),
  });
}
```

> **Tip** `setFormConfig()` is safe to call from `ngOnInit`, before `<ngs-form>` has rendered. The service waits for the form component to connect.

## 5. Submit and read the value

`setIsSubmitted(true)` makes every invalid field show its message, even the ones the user never touched. `isValid` tells you whether to go ahead, and `formValue` (or the `formValue$` stream) holds the data.

```ts
submit() {
  this.forms.setIsSubmitted(true);
  if (this.forms.isValid) {
    console.log(this.forms.formValue); // { registration: { username: '…', email: '…' } }
  }
}
```

To show the value in a template, convert the stream to a signal:

```ts
readonly value = toSignal(this.forms.formValue$);
```

## Next steps

- Add more field types and layout with the [Bootstrap component reference](/themes/bootstrap) and [Layout and structure](/guides/layout).
- Make fields appear on demand with [Conditional fields](/tutorials/conditional-fields).
- Learn how the pieces fit in [Core concepts](/guides/core-concepts).
