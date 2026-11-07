# Building a custom control

The built-in components cover the usual inputs, but the registry accepts any Angular component. This tutorial builds a star rating control, registers it next to the Bootstrap components, and makes it respond to form state so it can switch to a read-only summary.

::: demo custom-control

## 1. Define the configuration

Extend `NgsFormsFormItemConfigBaseInput` so your control accepts everything a normal input does (`name`, `label`, `validators`, `errorMessageMap`, `visible$`) plus its own options.

```ts title=rating.component.ts
export interface RatingConfig extends NgsFormsFormItemConfigBaseInput {
  max?: number;
  hint?: string;
}
```

## 2. Extend the input base class

`NgsFormsBaseClassFormInputComponent` does the plumbing for you:

| Member | What it gives you |
| --- | --- |
| `config` | The configuration from the form item. |
| `control` | An `UntypedFormControl`, already added to the parent group under `config.name`, with `validators` / `validators$` applied. |
| `errorMessage` | The message for the current error, or an empty string. Updated on value, status and submit changes. |
| `submitted()` | A signal that is `true` after `setIsSubmitted(true)`. |
| `commonState()` | A signal with the merged global and component state. |
| `id` | A unique id for `id` / `for` / `aria-*` attributes. |

Add a static `key` (the registry key) and a static `create()` factory:

```ts title=rating.component.ts
@Component({
  selector: 'app-rating-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating.component.html',
})
export class RatingInputComponent extends NgsFormsBaseClassFormInputComponent<RatingConfig> implements OnInit {
  static override key = 'rating';

  static create(config: RatingConfig): NgsFormsFormItem<RatingConfig> {
    return { uuid: config.uuid || uuid(), type: RatingInputComponent.key, config };
  }

  readonly max = computed(() => this.config.max ?? 5);
  readonly stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  rate(value: number) {
    this.control!.setValue(value);
    this.control!.markAsDirty();
    this.control!.markAsTouched();
  }
}
```

> **Important** If you override `ngOnInit()`, always call `super.ngOnInit()`: that is where the control is created, its validators are applied and run, and it is registered with the form. (Before 1.1.4 the validators did not run until the first change, so controls without `[formControl]` had to call `updateValueAndValidity()` themselves.)

## 3. Write the template

Use `control.value` to render, call your own methods to change it, and show `errorMessage`:

```html title=rating.component.html
@if (control) {
  <div class="mb-3">
    <div class="form-label" [id]="id + '-label'">{{ config.label }}</div>
    <div role="radiogroup" [attr.aria-labelledby]="id + '-label'">
      @for (star of stars(); track star) {
        <button type="button" role="radio"
                [attr.aria-checked]="control.value === star"
                [attr.aria-label]="star + ' of ' + max()"
                (click)="rate(star)">
          <i class="bi" [class.bi-star-fill]="star <= (control.value ?? 0)" [class.bi-star]="star > (control.value ?? 0)"></i>
        </button>
      }
    </div>
    @if (errorMessage) {
      <div class="text-danger small">{{ errorMessage }}</div>
    }
  </div>
}
```

If your control wraps a native input, bind it with `[formControl]="control"` (import `ReactiveFormsModule`) and you get value syncing, touched state and validation for free. That is what the Bootstrap and Material components do.

## 4. Register it

Register the component under its key, alongside a theme or on its own:

```ts
constructor() {
  const registry = inject(NgsFormsComponentRegistryService);
  NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
  registry.register(RatingInputComponent.key, RatingInputComponent);
}
```

Registering a key that already exists replaces the existing component. That is also how you override a built-in control: register your own component under `input-text`, for example.

## 5. Use it

```ts
RatingInputComponent.create({
  name: 'overall',
  label: 'How was your stay?',
  validators: [Validators.required],
  errorMessageMap: { required: 'Please give a rating.' },
}),
```

## Reacting to form state

`NgsFormsService` holds free-form state that every component can read through `commonState()`. Global state applies to every component; component state targets one item by `uuid` or `name` and wins over global state.

```ts
// Switch every component that understands it into read-only mode.
this.forms.updateGlobalState({ displayMode: 'summary' });

// Or target a single item by name.
this.forms.updateComponentState('overall', { displayMode: 'input' });
```

The rating control reads it in its template:

```html
@if (commonState().displayMode === 'summary') {
  <div>{{ control.value ? control.value + ' / ' + max() : 'Not rated' }}</div>
} @else {
  <!-- stars -->
}
```

> **Note** The built-in Bootstrap, Material and Tailwind components do not read `displayMode` yet. State is a channel for your own components. [Component state and edit toggle](/guides/component-state) covers the state layers and `toggleDisplayMode()`.

## Other kinds of custom items

- **Content without a control** (a banner, a help panel): extend `NgsFormsBaseClassFormComponent`. You get `config` but no control.
- **Containers** that render children: extend `NgsFormsBaseClassItemsContainerBase` and render each child with `<ng-container [ngs-form-item]="item"></ng-container>` (import `NgsFormsFormItemDirective`).
- **A whole design system**: implement one component per key (`input-text`, `input-textarea`, `checkbox`, `radio`, `select`, `toggle`, `button-group`, `range`, `typeahead`) and write a `registerAll…` helper like the theme packages do. Existing configurations then render with your components.
