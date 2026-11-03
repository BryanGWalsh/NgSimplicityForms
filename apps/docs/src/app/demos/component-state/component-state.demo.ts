import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  NgsFormComponent,
  NgsFormsComponentRegistryService,
  NgsFormsFormGroupComponent,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapModule } from '@ng-simplicity/forms-bootstrap';
import { FormStatePanelComponent } from '../shared/form-state-panel.component';
import { CompactFieldComponent } from './compact-field.component';

@Component({
  selector: 'docs-component-state-demo',
  imports: [NgsFormComponent, FormStatePanelComponent],
  providers: [NgsFormsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row g-4">
      <div class="col-lg-6" style="max-width: 420px">
        <ngs-form></ngs-form>
      </div>
      <div class="col-lg-6"><docs-form-state-panel></docs-form-state-panel></div>
    </div>
  `,
})
export class ComponentStateDemoComponent implements OnInit {
  private readonly forms = inject(NgsFormsService);

  constructor() {
    const registry = inject(NgsFormsComponentRegistryService);
    NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
    registry.register(CompactFieldComponent.key, CompactFieldComponent);
  }

  ngOnInit() {
    this.forms.setFormConfig({
      inputUpdateDebounce: 0,
      // Every field starts as a compact summary line with an Edit button.
      globalState: { displayMode: 'summary', showEditToggle: true },
      // Form level initialState targets items by name (or uuid).
      initialState: { notes: { showEditToggle: false } },
      root: NgsFormsFormGroupComponent.create({
        name: 'delivery',
        items: [
          CompactFieldComponent.create({ name: 'name', label: 'Name', value: 'Ada Lovelace' }),
          CompactFieldComponent.create({
            name: 'speed',
            label: 'Shipping',
            value: 'standard',
            options: [
              { id: 'standard', label: 'Standard (3 to 5 days)' },
              { id: 'express', label: 'Express (next day)' },
            ],
          }),
          // Item level initialState: the address is empty, so start it in input mode.
          CompactFieldComponent.create({
            name: 'address',
            label: 'Address',
            placeholder: '12 Analytical Row',
            validators: [Validators.required],
            errorMessageMap: { required: 'Where should we deliver?' },
            initialState: { displayMode: 'input' },
          }),
          // No toggle for this one (set in the form level initialState above), so it stays a summary.
          CompactFieldComponent.create({ name: 'notes', label: 'Notes', value: 'Leave at the door' }),
        ],
      }),
    });
  }
}
