import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
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

@Component({
  selector: 'docs-conditional-fields-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-7"><ngs-form></ngs-form></div>
      <div class="col-lg-5"><docs-form-state-panel></docs-form-state-panel></div>
    </div>
  `,
})
export class ConditionalFieldsDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    // Derive streams from the form's own value. The value is nested under the root group name.
    const value$ = this.forms.formValue$.pipe(map((value) => value?.contact ?? {}));
    const method$ = value$.pipe(
      map((v) => v.method),
      distinctUntilChanged()
    );
    const wantsUpdates$ = value$.pipe(
      map((v) => !!v.updates),
      distinctUntilChanged()
    );

    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'contact',
        items: [
          NgsFormsBootstrapRadioInputComponent.create({
            name: 'method',
            label: 'How should we reach you?',
            alignment: 'horizontal',
            options: [
              { id: 'email', label: 'Email' },
              { id: 'phone', label: 'Phone' },
              { id: 'none', label: "Don't contact me" },
            ],
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'email',
            label: 'Email address',
            type: 'email',
            validators: [Validators.required, Validators.email],
            errorMessageMap: { required: 'Email is required for email contact.', email: 'Enter a valid email.' },
            // Only rendered (and only validated) while "Email" is selected.
            visible$: method$.pipe(map((m) => m === 'email')),
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'phone',
            label: 'Phone number',
            placeholder: '555-123-4567',
            validators: [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)],
            errorMessageMap: { required: 'Phone is required for phone contact.', pattern: 'Use the format 555-123-4567.' },
            visible$: method$.pipe(map((m) => m === 'phone')),
          }),
          NgsFormsBootstrapFormsItemCheckboxComponent.create({
            name: 'updates',
            label: 'Send me product updates',
          }),
          // A whole group can be conditional too. Its value disappears from the form when hidden.
          NgsFormsFormGroupComponent.create({
            name: 'updatePreferences',
            visible$: wantsUpdates$,
            items: [
              NgsFormsBootstrapFormItemSelectInputComponent.create({
                name: 'frequency',
                label: 'How often?',
                labelLocation: 'top',
                options: [
                  { id: 'weekly', label: 'Weekly digest' },
                  { id: 'monthly', label: 'Monthly roundup' },
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }
}
