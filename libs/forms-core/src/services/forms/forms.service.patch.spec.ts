import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { NgsFormComponent } from '../../components/core/form/form.component';
import { NgsFormsService } from './forms.service';
import { NgsFormsComponentRegistryService } from '../form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../forms-core.module';
import { NgsFormsBaseClassFormInputComponent } from '../../classes/form-component-base/form-component-input.class';
import { NgsFormsFormGroupComponent } from '../../components/shared-form-components/form-group';
import { NgsFormsFormConfig } from '../../models';

@Component({
  selector: 'pv-input',
  imports: [ReactiveFormsModule],
  template: `@if (control) {<input [attr.data-name]="config.name" [formControl]="control" />}`,
})
class PvInputComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'pv-input';
}

const input = (name: string, extra: object = {}) => ({ uuid: name, type: 'pv-input', config: { name, label: name, ...extra } });

async function settle(fixture: any, rounds = 10) {
  for (let i = 0; i < rounds; i++) {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
  }
}

describe('NgsFormsService.patchValue while the form renders', () => {
  let service: NgsFormsService;

  function config(): NgsFormsFormConfig {
    const v$ = service.formValue$;
    return {
      root: NgsFormsFormGroupComponent.create({
        name: 'customer',
        items: [
          input('name'),
          input('vip'),
          // Shown by the patched `vip` value.
          input('accountManager', { visible$: v$.pipe(map((v) => v?.customer?.vip === 'yes')) }),
          // Shown by the patched `accountManager` value, which only exists once `vip` is patched: two levels deep.
          input('managerPhone', { visible$: v$.pipe(map((v) => !!v?.customer?.accountManager)) }),
          NgsFormsFormGroupComponent.create({
            name: 'address',
            visible$: v$.pipe(map((v) => v?.customer?.vip === 'yes')),
            items: [input('city')],
          }),
        ],
      }),
    } as any;
  }

  const DATA = { customer: { name: 'Acme', vip: 'yes', accountManager: 'Ann', managerPhone: '555', address: { city: 'Oslo' } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const reg = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(reg);
    reg.register(PvInputComponent.key, PvInputComponent);
    service = TestBed.inject(NgsFormsService);
  });

  it('applies a patch made in the same tick as setFormConfig, including fields the patch reveals', async () => {
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    service.setFormConfig(config());
    service.patchValue(DATA);
    await settle(fixture);
    expect(service.formValue).toEqual(DATA);
  });

  it('applies a patch made before <ngs-form> connects', async () => {
    service.setFormConfig(config());
    service.patchValue(DATA);
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    await settle(fixture);
    expect(service.formValue).toEqual(DATA);
  });

  it('applies several pending patches in call order', async () => {
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    service.setFormConfig(config());
    service.patchValue({ customer: { name: 'First', vip: 'yes' } });
    service.patchValue({ customer: { name: 'Second', accountManager: 'Ann' } });
    await settle(fixture);
    expect(service.formValue.customer).toEqual({ name: 'Second', vip: 'yes', accountManager: 'Ann', managerPhone: null, address: { city: null } });
  });

  it('stops once the form settles, so later edits are not overwritten', async () => {
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    service.setFormConfig(config());
    service.patchValue(DATA);
    await settle(fixture);
    const name = fixture.nativeElement.querySelector('input[data-name="name"]') as HTMLInputElement;
    name.value = 'Edited';
    name.dispatchEvent(new Event('input'));
    // Hide and show the conditional fields: their controls come and go, which must not re-apply the old patch.
    service.patchValue({ customer: { vip: 'no' } });
    await settle(fixture);
    expect(service.formValue.customer.name).toBe('Edited');
    expect(service.formValue.customer.accountManager).toBeUndefined();
  });

  it('setFormConfig drops patches still pending for the previous form', async () => {
    service.setFormConfig(config());
    service.patchValue(DATA);
    service.setFormConfig(config());
    const fixture = TestBed.createComponent(NgsFormComponent);
    fixture.detectChanges();
    await settle(fixture);
    expect(service.formValue.customer.name).toBeNull();
  });
});
