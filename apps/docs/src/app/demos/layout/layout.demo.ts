import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  NgsFormComponent,
  NgsFormsColumnComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsFormSectionComponent,
  NgsFormsRowComponent,
  NgsFormsService,
  NgsFormsTextDivComponent,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapModule,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

@Component({
  selector: 'docs-layout-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <docs-form-state-panel></docs-form-state-panel>
  `,
})
export class LayoutDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'order',
        items: [
          // A section adds a title and subtitle. It has no control, so its children stay at this level.
          NgsFormsFormSectionComponent.create({
            title: 'Contact',
            subtitle: 'Sections group fields visually without changing the value shape.',
            items: [
              // A row puts items side by side. Column classes come from any grid system, here Bootstrap.
              NgsFormsRowComponent.create({
                containerClass: 'row g-3',
                columnClasses: ['col-md-4', 'col-md-4', 'col-md-4'],
                items: [
                  NgsFormsBootstrapFormItemInputComponent.create({ name: 'firstName', label: 'First name' }),
                  NgsFormsBootstrapFormItemInputComponent.create({ name: 'lastName', label: 'Last name' }),
                  NgsFormsBootstrapFormItemInputComponent.create({ name: 'phone', label: 'Phone' }),
                ],
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'Shipping address',
            subtitle: 'A nested form group puts these values under "shipping".',
            items: [
              NgsFormsFormGroupComponent.create({
                name: 'shipping',
                items: [
                  NgsFormsBootstrapFormItemInputComponent.create({ name: 'street', label: 'Street' }),
                  NgsFormsRowComponent.create({
                    containerClass: 'row g-3',
                    columnClasses: ['col-md-6', 'col-md-3', 'col-md-3'],
                    items: [
                      NgsFormsBootstrapFormItemInputComponent.create({ name: 'city', label: 'City' }),
                      NgsFormsBootstrapFormItemInputComponent.create({ name: 'region', label: 'Region' }),
                      NgsFormsBootstrapFormItemInputComponent.create({ name: 'postcode', label: 'Postcode' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          NgsFormsFormSectionComponent.create({
            title: 'Options',
            subtitle: 'Horizontal labels and a column that stacks several items in one grid cell.',
            items: [
              NgsFormsBootstrapFormItemInputComponent.create({
                name: 'reference',
                label: 'PO number',
                labelLocation: 'left',
              }),
              NgsFormsBootstrapFormItemSelectInputComponent.create({
                name: 'speed',
                label: 'Delivery',
                options: [
                  { id: 'standard', label: 'Standard (3 to 5 days)' },
                  { id: 'express', label: 'Express (next day)' },
                ],
              }),
              NgsFormsRowComponent.create({
                containerClass: 'row g-3',
                columnClasses: ['col-md-6', 'col-md-6'],
                items: [
                  NgsFormsColumnComponent.create({
                    items: [
                      NgsFormsTextDivComponent.create({ text: 'Packaging', classes: 'fw-semibold mb-1' }),
                      NgsFormsBootstrapFormsItemCheckboxComponent.create({ name: 'giftWrap', label: 'Gift wrap' }),
                      NgsFormsBootstrapFormsItemCheckboxComponent.create({ name: 'noInvoice', label: 'Leave out the invoice' }),
                    ],
                  }),
                  NgsFormsColumnComponent.create({
                    items: [
                      NgsFormsTextDivComponent.create({ text: 'Notifications', classes: 'fw-semibold mb-1' }),
                      NgsFormsBootstrapFormsItemCheckboxComponent.create({ name: 'smsUpdates', label: 'Text me delivery updates' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }
}
