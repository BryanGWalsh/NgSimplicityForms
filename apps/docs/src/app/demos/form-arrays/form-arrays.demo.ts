import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormArrayAddItemComponent,
  NgsFormsFormArrayContainerComponent,
  NgsFormsFormArrayListComponent,
  NgsFormsFormArrayRemoveItemComponent,
  NgsFormsFormGroupComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapFormItemInputComponent, NgsFormsBootstrapModule } from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

interface LineItem {
  description?: string;
  quantity?: string;
  price?: string;
}

@Component({
  selector: 'docs-form-arrays-demo',
  imports: [NgsFormComponent, FormStatePanelComponent, CurrencyPipe],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-form></ngs-form>
    <div class="d-flex justify-content-end fw-semibold border-top pt-2 mb-3">
      Total: {{ total() | currency }}
    </div>
    <docs-form-state-panel></docs-form-state-panel>
  `,
})
export class FormArraysDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  private readonly value = toSignal(this.forms.formValue$);

  /** Derived from the form value like any other signal. */
  readonly total = computed(() =>
    ((this.value()?.invoice?.lines ?? []) as LineItem[]).reduce(
      (sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.price) || 0),
      0
    )
  );

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    // The template for ONE row. The list renders a copy of it for every entry in the array.
    const lineTemplate = NgsFormsRowComponent.create({
      containerClass: 'row g-2 align-items-start',
      columnClasses: ['col-sm-6', 'col-4 col-sm-2', 'col-4 col-sm-2', 'col-4 col-sm-2 pt-sm-4 mt-sm-2'],
      items: [
        NgsFormsBootstrapFormItemInputComponent.create({
          name: 'description',
          label: 'Description',
          validators: [Validators.required],
          errorMessageMap: { required: 'Required.' },
        }),
        NgsFormsBootstrapFormItemInputComponent.create({
          name: 'quantity',
          label: 'Qty',
          validators: [Validators.required, Validators.min(1)],
          errorMessageMap: { required: 'Required.', min: 'At least 1.' },
        }),
        NgsFormsBootstrapFormItemInputComponent.create({
          name: 'price',
          label: 'Unit price',
          validators: [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
          errorMessageMap: { required: 'Required.', pattern: 'Use a number like 9.99.' },
        }),
        NgsFormsFormArrayRemoveItemComponent.create({
          buttonText: 'Remove',
          buttonIcon: 'bi bi-trash me-1',
          buttonClass: 'btn btn-outline-danger btn-sm w-100',
        }),
      ],
    });

    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'invoice',
        items: [
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'customer',
            label: 'Customer',
            validators: [Validators.required],
            errorMessageMap: { required: 'Who is this invoice for?' },
          }),
          NgsFormsFormArrayContainerComponent.create({
            name: 'lines',
            initialItemCount: 2,
            minItems: 1,
            maxItems: 5,
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: lineTemplate,
                containerClass: 'border rounded p-2 mb-2 bg-body-tertiary',
              }),
              NgsFormsFormArrayAddItemComponent.create({
                buttonText: 'Add line',
                buttonIcon: 'bi bi-plus-lg me-1',
                buttonClass: 'btn btn-outline-primary btn-sm',
              }),
            ],
          }),
        ],
      }),
    });
  }
}
