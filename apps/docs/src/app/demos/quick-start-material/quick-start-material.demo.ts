import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { MatButtonModule } from '@angular/material/button';
import {
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialModule,
} from '@ng-simplicity/forms-material';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

@Component({
  selector: 'docs-quick-start-material-demo',
  imports: [NgsFormComponent, MatButtonModule, FormStatePanelComponent],
  // 1. Each form gets its own NgsFormsService.
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-md-7">
        <!-- 3. Render the form -->
        <ngs-form></ngs-form>
        <button mat-flat-button type="button" (click)="submit()">Register</button>
        @if (message()) {
          <p class="mt-2 mb-0 small">{{ message() }}</p>
        }
      </div>
      <div class="col-md-5">
        <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
      </div>
    </div>
  `,
})
export class QuickStartMaterialDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);
  readonly message = signal('');

  constructor() {
    // 2. Register the Material components (and the core layout components) with the registry.
    NgsFormsMaterialModule.registerAllMaterialComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    // 4. Describe the form.
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'registration',
        items: [
          NgsFormsMaterialFormItemInputComponent.create({
            name: 'username',
            label: 'Username',
            placeholder: 'Choose a username',
            validators: [Validators.required, Validators.minLength(4)],
            errorMessageMap: {
              required: 'Pick a username.',
              minlength: 'Use at least 4 characters.',
            },
          }),
          NgsFormsMaterialFormItemInputComponent.create({
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
