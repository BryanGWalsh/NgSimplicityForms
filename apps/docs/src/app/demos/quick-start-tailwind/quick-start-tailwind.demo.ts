import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindModule,
} from '@ng-simplicity/forms-tailwind';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

@Component({
  selector: 'docs-quick-start-tailwind-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  // 1. Each form gets its own NgsFormsService.
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-6 md:grid-cols-12">
      <div class="md:col-span-7">
        <!-- 3. Render the form -->
        <ngs-form></ngs-form>
        <button
          type="button"
          class="rounded-md border-0 bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          (click)="submit()"
        >
          Register
        </button>
        @if (message()) {
          <p class="mt-2 text-sm">{{ message() }}</p>
        }
      </div>
      <div class="md:col-span-5">
        <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
      </div>
    </div>
  `,
})
export class QuickStartTailwindDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);
  readonly message = signal('');

  constructor() {
    // 2. Register the Tailwind components (and the core layout components) with the registry.
    NgsFormsTailwindModule.registerAllTailwindComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    // 4. Describe the form.
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'registration',
        items: [
          NgsFormsTailwindFormItemInputComponent.create({
            name: 'username',
            label: 'Username',
            placeholder: 'Choose a username',
            validators: [Validators.required, Validators.minLength(4)],
            errorMessageMap: {
              required: 'Pick a username.',
              minlength: 'Use at least 4 characters.',
            },
          }),
          NgsFormsTailwindFormItemInputComponent.create({
            name: 'email',
            label: 'Email address',
            placeholder: 'you@example.com',
            type: 'email',
            validators: [Validators.required, Validators.email],
            errorMessageMap: {
              required: 'We need your email address.',
              email: 'That does not look like an email address.',
            },
          }),
        ],
      }),
    });
  }

  submit() {
    // 5. Show every error, then read the value if the form is valid.
    this.forms.setIsSubmitted(true);
    this.submitted.set(true);
    this.message.set(
      this.forms.isValid
        ? `Submitted: ${JSON.stringify(this.forms.formValue)}`
        : 'Fix the highlighted fields and try again.'
    );
  }
}
