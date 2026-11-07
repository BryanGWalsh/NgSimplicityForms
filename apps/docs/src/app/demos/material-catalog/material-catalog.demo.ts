import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsFormSectionComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsMaterialFormItemCheckboxComponent,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemSelectInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent,
  NgsFormsMaterialModule,
  NgsFormsMaterialRadioInputComponent,
  NgsFormsMaterialFormItemToggleComponent,
  NgsFormsMaterialFormItemButtonGroupComponent,
  NgsFormsMaterialFormItemRangeComponent,
  NgsFormsMaterialFormItemTypeaheadComponent,
  NgsFormsMaterialFormItemDatepickerComponent,
  NgsFormsMaterialFormItemChipsComponent,
} from '@ng-simplicity/forms-material';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

const OPTIONS = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'xl', label: 'Extra large (sold out)', disabled: true },
];

@Component({
  selector: 'docs-material-catalog-demo',
  imports: [NgsFormComponent, MatButtonModule, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button mat-flat-button type="button" class="mb-3" (click)="submitted.set(true); forms.setIsSubmitted(true)">
      Show validation errors
    </button>
    <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
  `,
})
export class MaterialCatalogDemoComponent implements OnInit {
  readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);

  constructor() {
    NgsFormsMaterialModule.registerAllMaterialComponents(inject(NgsFormsComponentRegistryService));
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
            subtitle: 'NgsFormsMaterialFormItemInputComponent',
            items: [
              NgsFormsRowComponent.create({
                containerClass: 'row g-3',
                columnClass: 'col-md-6',
                items: [
                  NgsFormsMaterialFormItemInputComponent.create({
                    name: 'text',
                    label: 'Name',
                    placeholder: 'Ada Lovelace',
                    validators: required,
                    errorMessageMap: { required: 'Name is required.' },
                  }),
                  NgsFormsMaterialFormItemInputComponent.create({ name: 'email', label: 'Email', type: 'email', validators: [Validators.email] }),
                ],
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'input-textarea',
            subtitle: 'NgsFormsMaterialFormItemTextAreaComponent',
            items: [NgsFormsMaterialFormItemTextAreaComponent.create({ name: 'notes', label: 'Notes', rows: 4 })],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'select',
            subtitle: 'NgsFormsMaterialFormItemSelectInputComponent',
            items: [
              NgsFormsMaterialFormItemSelectInputComponent.create({
                name: 'size',
                label: 'Size',
                options: OPTIONS,
                validators: required,
                errorMessageMap: { required: 'Choose a size.' },
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'radio',
            subtitle: 'NgsFormsMaterialRadioInputComponent',
            items: [
              NgsFormsMaterialRadioInputComponent.create({ name: 'radioVertical', label: 'Vertical (default)', options: OPTIONS, validators: required }),
              NgsFormsMaterialRadioInputComponent.create({ name: 'radioHorizontal', label: 'Horizontal', alignment: 'horizontal', options: OPTIONS }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'checkbox',
            subtitle: 'NgsFormsMaterialFormItemCheckboxComponent',
            items: [
              NgsFormsMaterialFormItemCheckboxComponent.create({
                name: 'agree',
                label: 'I agree',
                validators: [Validators.requiredTrue],
                errorMessageMap: { required: 'Please agree to continue.' },
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'toggle',
            subtitle: 'NgsFormsMaterialFormItemToggleComponent',
            items: [NgsFormsMaterialFormItemToggleComponent.create({ name: 'notifications', label: 'Email notifications' })],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'button-group',
            subtitle: 'NgsFormsMaterialFormItemButtonGroupComponent',
            items: [
              NgsFormsMaterialFormItemButtonGroupComponent.create({
                name: 'buttonSize',
                label: 'One choice',
                options: OPTIONS,
                validators: required,
                errorMessageMap: { required: 'Choose a size.' },
              }),
              NgsFormsMaterialFormItemButtonGroupComponent.create({ name: 'buttonSizes', label: 'Multiple choice (multiple: true)', multiple: true, options: OPTIONS }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'range',
            subtitle: 'NgsFormsMaterialFormItemRangeComponent',
            items: [NgsFormsMaterialFormItemRangeComponent.create({ name: 'volume', label: 'Volume', min: 0, max: 100, step: 5, value: 40, valueSuffix: '%' })],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'typeahead',
            subtitle: 'NgsFormsMaterialFormItemTypeaheadComponent',
            items: [
              NgsFormsMaterialFormItemTypeaheadComponent.create({
                name: 'fruit',
                label: 'Fruit',
                placeholder: 'Start typing',
                options: ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango'].map((f) => ({ id: f, label: f })),
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'datepicker',
            subtitle: 'NgsFormsMaterialFormItemDatepickerComponent',
            items: [
              NgsFormsMaterialFormItemDatepickerComponent.create({
                name: 'startDate',
                label: 'Start date',
                min: new Date(2020, 0, 1),
                validators: required,
                errorMessageMap: { required: 'Pick a date.', matDatepickerParse: 'Enter a valid date.', matDatepickerMin: 'From 2020 onwards.' },
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'chips',
            subtitle: 'NgsFormsMaterialFormItemChipsComponent',
            items: [NgsFormsMaterialFormItemChipsComponent.create({ name: 'tags', label: 'Tags', placeholder: 'Type and press Enter', value: ['angular'] })],
          }),
        ],
      }),
    });
  }
}
