import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { distinctUntilChanged, map, tap } from 'rxjs';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapModule,
  NgsFormsBootstrapRadioInputComponent,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

/** A custom validator. Its error key ("reserved") is what errorMessageMap uses. */
const notReserved: ValidatorFn = (control) =>
  ['admin', 'root'].includes(String(control.value ?? '').toLowerCase()) ? { reserved: true } : null;

@Component({
  selector: 'docs-validation-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-7">
        <ngs-form></ngs-form>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-primary" (click)="submit(true)">Submit</button>
          <button type="button" class="btn btn-outline-secondary" (click)="submit(false)">Clear submitted</button>
        </div>
      </div>
      <div class="col-lg-5"><docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel></div>
    </div>
  `,
})
export class ValidationDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    const accountType$ = this.forms.formValue$.pipe(
      map((v) => v?.account?.type),
      distinctUntilChanged()
    );

    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'account',
        items: [
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'handle',
            label: 'Handle',
            validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9_]*$/i), notReserved],
            errorMessageMap: {
              required: 'Pick a handle.',
              minlength: 'At least 3 characters.',
              pattern: 'Letters, numbers and underscores only.',
              reserved: 'That handle is reserved.',
            },
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'age',
            label: 'Age (no errorMessageMap, so the fallback message shows)',
            validators: [Validators.min(13), Validators.max(120)],
          }),
          NgsFormsBootstrapRadioInputComponent.create({
            name: 'type',
            label: 'Account type',
            alignment: 'horizontal',
            options: [
              { id: 'personal', label: 'Personal' },
              { id: 'business', label: 'Business' },
            ],
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'vatNumber',
            label: 'VAT number (required for business accounts)',
            // validators$ swaps the rule set whenever the stream emits.
            validators$: accountType$.pipe(
              map((type): ValidatorFn[] => (type === 'business' ? [Validators.required] : [])),
              // New validators apply on the control's next value change. Re-patch the current value right
              // after the swap so the field is re-validated immediately (see "Status and limitations").
              tap(() => queueMicrotask(() => this.revalidate('vatNumber')))
            ),
            errorMessageMap: { required: 'Business accounts need a VAT number.' },
          }),
        ],
      }),
    });
  }

  private revalidate(name: string) {
    this.forms.patchValue({ account: { [name]: this.forms.formValue?.account?.[name] ?? null } });
  }

  submit(value: boolean) {
    this.forms.setIsSubmitted(value);
    this.submitted.set(value);
  }
}
