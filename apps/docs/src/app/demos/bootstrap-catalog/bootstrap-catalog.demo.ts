import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsFormSectionComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapFormsItemTextAreaComponent,
  NgsFormsBootstrapModule,
  NgsFormsBootstrapRadioInputComponent,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

const OPTIONS = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'xl', label: 'Extra large (sold out)', disabled: true },
];

@Component({
  selector: 'docs-bootstrap-catalog-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button type="button" class="btn btn-primary btn-sm mb-3" (click)="submitted.set(true); forms.setIsSubmitted(true)">
      Show validation errors
    </button>
    <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
  `,
})
export class BootstrapCatalogDemoComponent implements OnInit {
  readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    const required = [Validators.required];
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'catalog',
        items: [
          NgsFormsFormSectionComponent.create({
            title: 'input-text',
            subtitle: 'NgsFormsBootstrapFormItemInputComponent',
            items: [
              NgsFormsBootstrapFormItemInputComponent.create({ name: 'text', label: 'Label on top (default)', placeholder: 'Placeholder', validators: required }),
              NgsFormsBootstrapFormItemInputComponent.create({ name: 'leftLabel', label: 'Left label', labelLocation: 'left' }),
              NgsFormsBootstrapFormItemInputComponent.create({ name: 'password', label: 'Password', type: 'password' }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'input-textarea',
            subtitle: 'NgsFormsBootstrapFormsItemTextAreaComponent',
            items: [
              NgsFormsBootstrapFormsItemTextAreaComponent.create({
                name: 'notes',
                label: 'Notes',
                placeholder: 'Write something…',
                validators: [Validators.maxLength(200)],
                errorMessageMap: { maxlength: 'Keep it under 200 characters.' },
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'select',
            subtitle: 'NgsFormsBootstrapFormItemSelectInputComponent',
            items: [
              NgsFormsBootstrapFormItemSelectInputComponent.create({
                name: 'size',
                label: 'Size',
                labelLocation: 'top',
                placeholder: 'Choose a size',
                options: OPTIONS,
                validators: required,
                errorMessageMap: { required: 'Choose a size.' },
              }),
              NgsFormsBootstrapFormItemSelectInputComponent.create({ name: 'sizeLeft', label: 'Left label', labelLocation: 'left', options: OPTIONS }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'radio',
            subtitle: 'NgsFormsBootstrapRadioInputComponent',
            items: [
              NgsFormsBootstrapRadioInputComponent.create({ name: 'radioVertical', label: 'Vertical (default)', options: OPTIONS, validators: required }),
              NgsFormsBootstrapRadioInputComponent.create({ name: 'radioHorizontal', label: 'Horizontal', alignment: 'horizontal', options: OPTIONS }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'checkbox',
            subtitle: 'NgsFormsBootstrapFormsItemCheckboxComponent',
            items: [
              NgsFormsBootstrapFormsItemCheckboxComponent.create({
                name: 'agree',
                label: 'I agree (Validators.requiredTrue)',
                validators: [Validators.requiredTrue],
                errorMessageMap: { required: 'Please agree to continue.' },
              }),
            ],
          }),
        ],
      }),
    });
  }
}
