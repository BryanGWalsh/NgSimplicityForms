# Quick start: Angular Material

The Material package renders the same configuration with Angular Material form fields. This page assumes you have followed the [Material installation steps](/getting-started/installation#with-angular-material).

::: demo quick-start-material

## 1. Make sure animations are provided

Material components need the animations provider. `ng add @angular/material` adds it for you; otherwise add it yourself:

```ts title=app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideAnimationsAsync()],
};
```

## 2. Provide the service and register the components

```ts title=registration.component.ts
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgsFormComponent, NgsFormsComponentRegistryService, NgsFormsService } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialModule } from '@ng-simplicity/forms-material';

@Component({
  selector: 'app-registration',
  imports: [NgsFormComponent, MatButtonModule],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button mat-flat-button type="button" (click)="submit()">Register</button>
  `,
})
export class RegistrationComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    NgsFormsMaterialModule.registerAllMaterialComponents(inject(NgsFormsComponentRegistryService));
  }
}
```

## 3. Describe the form

The configuration is the same as in the Bootstrap quick start. Only the component classes change.

```ts
import { Validators } from '@angular/forms';
import { NgsFormsFormGroupComponent } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialFormItemInputComponent } from '@ng-simplicity/forms-material';

ngOnInit() {
  this.forms.setFormConfig({
    inputUpdateDebounce: 0,
    globalState: {},
    root: NgsFormsFormGroupComponent.create({
      name: 'registration',
      items: [
        NgsFormsMaterialFormItemInputComponent.create({
          name: 'username',
          label: 'Username',
          validators: [Validators.required, Validators.minLength(4)],
          errorMessageMap: { required: 'Pick a username.', minlength: 'Use at least 4 characters.' },
        }),
        NgsFormsMaterialFormItemInputComponent.create({
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

submit() {
  this.forms.setIsSubmitted(true);
}
```

The Material inputs use a custom `ErrorStateMatcher`, so `mat-error` messages appear after `setIsSubmitted(true)` as well as after the user touches a field.

## 4. Add the supporting styles

The Material components use a few utility classes (`w-100`, `mb-2`, `mb-3`) and leave the radio group layout to the application. If your app does not already load Bootstrap's utilities, add these rules to your global stylesheet:

```scss title=styles.scss
.w-100 { width: 100%; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }

.ngs-material-radio-field { display: grid; gap: 8px; }
.ngs-material-radio-label { font-weight: 500; }
.ngs-material-radio-group-horizontal { display: flex; flex-wrap: wrap; gap: 16px; }
.ngs-material-radio-group-vertical { display: grid; gap: 8px; }
.ngs-material-control-error { color: #b00020; font-size: 0.75rem; }
```

## Next steps

- See every Material control in the [Material component reference](/themes/material).
- The [tutorials](/tutorials/sign-up-form) use Bootstrap, but every configuration in them works with Material by swapping the component classes.
