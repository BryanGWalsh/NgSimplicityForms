# Quick start: Tailwind CSS

The Tailwind package renders the same configuration with plain HTML controls styled by Tailwind utility classes. This page assumes you have followed the [Tailwind installation steps](/getting-started/installation#with-tailwind-css).

::: demo quick-start-tailwind

## 1. Point Tailwind at the package

Tailwind only generates the classes it finds in your sources, and it skips `node_modules`. Add an `@source` line for the package to the stylesheet that imports Tailwind, or the components render unstyled:

```css title=src/styles.css
@import 'tailwindcss';
@source '../node_modules/@ng-simplicity/forms-tailwind';
```

The path is relative to the stylesheet. In an Nx workspace where the stylesheet is in `apps/<app>/src`, it is `../../../node_modules/@ng-simplicity/forms-tailwind`.

## 2. Provide the form service

Every form needs its own `NgsFormsService`. Provide it on the component that will host the form.

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

## 3. Register the Tailwind components

`registerAllTailwindComponents()` registers the structural components from the core package and the five Tailwind inputs, under the same keys the Bootstrap and Material packages use.

```ts
import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsTailwindModule } from '@ng-simplicity/forms-tailwind';

constructor() {
  NgsFormsTailwindModule.registerAllTailwindComponents(inject(NgsFormsComponentRegistryService));
}
```

## 4. Render and describe the form

Put `<ngs-form>` in the template, then call `setFormConfig()` with items made by the Tailwind `create()` helpers.

```html title=registration.component.html
<ngs-form></ngs-form>
<button type="button" class="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700" (click)="submit()">
  Register
</button>
```

```ts
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgsFormsFormGroupComponent } from '@ng-simplicity/forms-core';
import { NgsFormsTailwindFormItemInputComponent } from '@ng-simplicity/forms-tailwind';

ngOnInit() {
  this.forms.setFormConfig({
    inputUpdateDebounce: 0,
    globalState: {},
    root: NgsFormsFormGroupComponent.create({
      name: 'registration',
      items: [
        NgsFormsTailwindFormItemInputComponent.create({
          name: 'username',
          label: 'Username',
          validators: [Validators.required, Validators.minLength(4)],
          errorMessageMap: { required: 'Pick a username.', minlength: 'Use at least 4 characters.' },
        }),
        NgsFormsTailwindFormItemInputComponent.create({
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

## 5. Submit and read the value

```ts
submit() {
  this.forms.setIsSubmitted(true);
  if (this.forms.isValid) {
    console.log(this.forms.formValue); // { registration: { username: '…', email: '…' } }
  }
}
```

## 6. Make it yours (optional)

Every class the components use comes from the `NGS_FORMS_TAILWIND_CLASSES` token. Override the parts you want with `provideNgsFormsTailwindClasses()`; everything you leave out keeps its default.

```ts title=app.config.ts
import { provideNgsFormsTailwindClasses } from '@ng-simplicity/forms-tailwind';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgsFormsTailwindClasses({
      controlValid: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/40',
      choiceInput: 'h-4 w-4 cursor-pointer accent-emerald-600',
    }),
  ],
};
```

See the [Tailwind component reference](/themes/tailwind#customising-the-classes) for every class slot.

## Next steps

- Add more field types with the [Tailwind component reference](/themes/tailwind) and [Layout and structure](/guides/layout).
- Make fields appear on demand with [Conditional fields](/tutorials/conditional-fields). The tutorials use Bootstrap, but the configuration is the same with Tailwind: swap the `create()` helpers.
