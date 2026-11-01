import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapModule,
  NgsFormsBootstrapRadioInputComponent,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

/** Passes when the value equals the sibling control called `otherName`. */
function matches(otherName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const other = control.parent?.get(otherName);
    return !other || other.value === control.value ? null : { mismatch: true };
  };
}

/** At least one digit and one letter. */
const strongPassword: ValidatorFn = (control) =>
  !control.value || (/\d/.test(control.value) && /[a-z]/i.test(control.value)) ? null : { weak: true };

@Component({
  selector: 'docs-sign-up-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-7">
        <ngs-form></ngs-form>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-primary" (click)="submit()">Create account</button>
          <button type="button" class="btn btn-outline-secondary" (click)="reset()">Reset</button>
        </div>
        @if (result()) {
          <div class="alert mt-3 mb-0 py-2" [class.alert-success]="result() === 'ok'" [class.alert-danger]="result() === 'invalid'">
            {{ result() === 'ok' ? 'Account created. Check the value panel for the payload.' : 'Please fix the errors above.' }}
          </div>
        }
      </div>
      <div class="col-lg-5">
        <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
      </div>
    </div>
  `,
})
export class SignUpDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);
  readonly result = signal<'ok' | 'invalid' | ''>('');

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'signUp',
        items: [
          NgsFormsRowComponent.create({
            containerClass: 'row g-3',
            columnClass: 'col-sm-6',
            items: [
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'firstName',
                label: 'First name',
                validators: [Validators.required],
                errorMessageMap: { required: 'First name is required.' },
              }),
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'lastName',
                label: 'Last name',
                validators: [Validators.required],
                errorMessageMap: { required: 'Last name is required.' },
              }),
            ],
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'email',
            label: 'Work email',
            type: 'email',
            placeholder: 'ada@example.com',
            validators: [Validators.required, Validators.email],
            errorMessageMap: { required: 'Email is required.', email: 'Enter a valid email address.' },
          }),
          NgsFormsRowComponent.create({
            containerClass: 'row g-3',
            columnClass: 'col-sm-6',
            items: [
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'password',
                label: 'Password',
                type: 'password',
                validators: [Validators.required, Validators.minLength(8), strongPassword],
                errorMessageMap: {
                  required: 'Choose a password.',
                  minlength: 'Use at least 8 characters.',
                  weak: 'Mix letters and numbers.',
                },
              }),
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'confirmPassword',
                label: 'Confirm password',
                type: 'password',
                validators: [Validators.required, matches('password')],
                errorMessageMap: { required: 'Repeat your password.', mismatch: 'Passwords do not match.' },
              }),
            ],
          }),
          NgsFormsBootstrapFormItemSelectInputComponent.create({
            name: 'teamSize',
            label: 'Team size',
            labelLocation: 'top',
            placeholder: 'Select…',
            options: [
              { id: '1', label: 'Just me' },
              { id: '2-10', label: '2 to 10' },
              { id: '11-50', label: '11 to 50' },
              { id: '50+', label: 'More than 50' },
            ],
            validators: [Validators.required],
            errorMessageMap: { required: 'Pick a team size.' },
          }),
          NgsFormsBootstrapRadioInputComponent.create({
            name: 'plan',
            label: 'Plan',
            alignment: 'horizontal',
            options: [
              { id: 'free', label: 'Free' },
              { id: 'pro', label: 'Pro' },
              { id: 'enterprise', label: 'Enterprise', disabled: true },
            ],
            validators: [Validators.required],
            errorMessageMap: { required: 'Choose a plan.' },
          }),
          NgsFormsBootstrapFormsItemCheckboxComponent.create({
            name: 'acceptTerms',
            label: 'I accept the terms of service',
            validators: [Validators.requiredTrue],
            errorMessageMap: { required: 'You need to accept the terms.' },
          }),
        ],
      }),
    });
  }

  submit() {
    this.forms.setIsSubmitted(true);
    this.submitted.set(true);
    this.result.set(this.forms.isValid ? 'ok' : 'invalid');
  }

  reset() {
    // setFormConfig rebuilds the form and clears the submitted flag.
    this.buildForm();
    this.submitted.set(false);
    this.result.set('');
  }
}
