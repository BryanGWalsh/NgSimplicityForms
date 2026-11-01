import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsFormSectionComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindFormItemCheckboxComponent,
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindFormItemSelectInputComponent,
  NgsFormsTailwindFormItemTextAreaComponent,
  NgsFormsTailwindModule,
  NgsFormsTailwindRadioInputComponent,
} from '@ng-simplicity/forms-tailwind';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

const OPTIONS = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
  { id: 'xl', label: 'Extra large (sold out)', disabled: true },
];

@Component({
  selector: 'docs-tailwind-catalog-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <button
      type="button"
      class="mb-4 rounded-md border-0 bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-700"
      (click)="submitted.set(true); forms.setIsSubmitted(true)"
    >
      Show validation errors
    </button>
    <docs-form-state-panel [submitted]="submitted()"></docs-form-state-panel>
  `,
})
export class TailwindCatalogDemoComponent implements OnInit {
  readonly forms = inject(NgsFormsService);
  readonly submitted = signal(false);

  constructor() {
    NgsFormsTailwindModule.registerAllTailwindComponents(inject(NgsFormsComponentRegistryService));
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
            subtitle: 'NgsFormsTailwindFormItemInputComponent',
            items: [
              NgsFormsTailwindFormItemInputComponent.create({ name: 'text', label: 'Label on top (default)', placeholder: 'Placeholder', validators: required }),
              NgsFormsTailwindFormItemInputComponent.create({ name: 'leftLabel', label: 'Left label', labelLocation: 'left' }),
              // Rows take any classes, so a Tailwind grid lays fields out side by side.
              NgsFormsRowComponent.create({
                containerClass: 'grid gap-x-4 sm:grid-cols-2',
                items: [
                  NgsFormsTailwindFormItemInputComponent.create({ name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' }),
                  NgsFormsTailwindFormItemInputComponent.create({ name: 'password', label: 'Password', type: 'password' }),
                ],
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'input-textarea',
            subtitle: 'NgsFormsTailwindFormItemTextAreaComponent',
            items: [
              NgsFormsTailwindFormItemTextAreaComponent.create({
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
            subtitle: 'NgsFormsTailwindFormItemSelectInputComponent',
            items: [
              NgsFormsTailwindFormItemSelectInputComponent.create({
                name: 'size',
                label: 'Size',
                placeholder: 'Choose a size',
                options: OPTIONS,
                validators: required,
                errorMessageMap: { required: 'Choose a size.' },
              }),
              NgsFormsTailwindFormItemSelectInputComponent.create({ name: 'sizeLeft', label: 'Left label', labelLocation: 'left', options: OPTIONS }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'radio',
            subtitle: 'NgsFormsTailwindRadioInputComponent',
            items: [
              NgsFormsTailwindRadioInputComponent.create({ name: 'radioVertical', label: 'Vertical (default)', options: OPTIONS.slice(0, 3), validators: required }),
              NgsFormsTailwindRadioInputComponent.create({ name: 'radioHorizontal', label: 'Horizontal', alignment: 'horizontal', options: OPTIONS.slice(0, 3) }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'checkbox',
            subtitle: 'NgsFormsTailwindFormItemCheckboxComponent',
            items: [
              NgsFormsTailwindFormItemCheckboxComponent.create({
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
