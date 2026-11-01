import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { delay, distinctUntilChanged, firstValueFrom, map, of } from 'rxjs';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormArrayAddItemComponent,
  NgsFormsFormArrayContainerComponent,
  NgsFormsFormArrayListComponent,
  NgsFormsFormArrayRemoveItemComponent,
  NgsFormsFormConfig,
  NgsFormsFormGroupComponent,
  NgsFormsRowComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapModule,
} from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';

interface Customer {
  name: string;
  email: string;
  vip: boolean;
  accountManager?: string;
  contacts: { name: string; phone: string }[];
}

const CUSTOMERS: Record<string, Customer> = {
  acme: {
    name: 'Acme Corp',
    email: 'billing@acme.test',
    vip: true,
    accountManager: 'Grace Hopper',
    contacts: [
      { name: 'Wile E. Coyote', phone: '555-010-0001' },
      { name: 'Road Runner', phone: '555-010-0002' },
      { name: 'Marvin', phone: '555-010-0003' },
    ],
  },
  initech: {
    name: 'Initech',
    email: 'accounts@initech.test',
    vip: false,
    contacts: [{ name: 'Bill Lumbergh', phone: '555-020-0001' }],
  },
};

/** Stand-in for an HTTP request. */
const fetchCustomer = (id: string) => of(CUSTOMERS[id]).pipe(delay(300));

/** Resolves after the current render pass, once newly created controls have joined the form. */
const nextRender = () => new Promise((resolve) => setTimeout(resolve));

@Component({
  selector: 'docs-editing-data-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-wrap gap-2 mb-3">
      <button type="button" class="btn btn-sm btn-outline-primary" (click)="load('acme')" [disabled]="loading()">Load Acme Corp</button>
      <button type="button" class="btn btn-sm btn-outline-primary" (click)="load('initech')" [disabled]="loading()">Load Initech</button>
      <button type="button" class="btn btn-sm btn-outline-secondary" (click)="clear()" [disabled]="loading()">New customer</button>
      @if (loading()) {
        <span class="small text-body-secondary align-self-center">Loading…</span>
      }
    </div>
    <div class="row g-4">
      <div class="col-lg-7"><ngs-form></ngs-form></div>
      <div class="col-lg-5"><docs-form-state-panel></docs-form-state-panel></div>
    </div>
  `,
})
export class EditingDataDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);
  readonly loading = signal(false);

  constructor() {
    NgsFormsBootstrapModule.registerAllBootStrapComponents(inject(NgsFormsComponentRegistryService));
  }

  ngOnInit() {
    this.forms.setFormConfig(this.buildConfig(1));
  }

  async load(id: string) {
    this.loading.set(true);
    const customer = await firstValueFrom(fetchCustomer(id));

    // 1. Rebuild the form with one array row per contact, so the array has somewhere to put each value.
    this.forms.setFormConfig(this.buildConfig(customer.contacts.length));
    await nextRender();

    // 2. Patch the values. The shape matches formValue$, including the root group name.
    this.forms.patchValue({ customer });

    // 3. Fields behind visible$ are only created once the value that shows them is set,
    //    so patch once more for them.
    await nextRender();
    this.forms.patchValue({ customer: { accountManager: customer.accountManager } });
    this.loading.set(false);
  }

  clear() {
    this.forms.setFormConfig(this.buildConfig(1));
  }

  private buildConfig(contactCount: number): NgsFormsFormConfig {
    const vip$ = this.forms.formValue$.pipe(
      map((v) => !!v?.customer?.vip),
      distinctUntilChanged()
    );
    return {
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormGroupComponent.create({
        name: 'customer',
        items: [
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'name',
            label: 'Company name',
            validators: [Validators.required],
          }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'email',
            label: 'Billing email',
            type: 'email',
            validators: [Validators.required, Validators.email],
          }),
          NgsFormsBootstrapFormsItemCheckboxComponent.create({ name: 'vip', label: 'VIP customer' }),
          NgsFormsBootstrapFormItemInputComponent.create({
            name: 'accountManager',
            label: 'Account manager',
            visible$: vip$,
          }),
          NgsFormsFormArrayContainerComponent.create({
            name: 'contacts',
            initialItemCount: contactCount,
            minItems: 1,
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: NgsFormsRowComponent.create({
                  containerClass: 'row g-2',
                  columnClasses: ['col-sm-5', 'col-sm-5', 'col-sm-2 pt-sm-4 mt-sm-2'],
                  items: [
                    NgsFormsBootstrapFormItemInputComponent.create({ name: 'name', label: 'Contact name' }),
                    NgsFormsBootstrapFormItemInputComponent.create({ name: 'phone', label: 'Phone' }),
                    NgsFormsFormArrayRemoveItemComponent.create({
                      buttonText: 'Remove',
                      buttonIcon: 'bi bi-x-lg me-1',
                      buttonClass: 'btn btn-outline-danger btn-sm',
                    }),
                  ],
                }),
              }),
              NgsFormsFormArrayAddItemComponent.create({
                buttonText: 'Add contact',
                buttonClass: 'btn btn-outline-primary btn-sm',
              }),
            ],
          }),
        ],
      }),
    };
  }
}
