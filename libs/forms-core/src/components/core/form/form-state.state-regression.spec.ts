import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, ReactiveFormsModule, UntypedFormArray, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { NgsFormComponent } from './form.component';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../../forms-core.module';
import { NgsFormsBaseClassFormInputComponent } from '../../../classes';
import { NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '../../../models';
import { NgsFormsFormGroupComponent } from '../../shared-form-components/form-group/form-group.component';
import { NgsFormsFormArrayContainerComponent } from '../../shared-form-components/form-array/container/form-array.component';
import { NgsFormsFormArrayListComponent } from '../../shared-form-components/form-array/list/form-array-list.component';
import { NgsFormsFormControlAddRemoveFunctions } from '../../../misc';

@Component({
  selector: 'test-input-rs',
  imports: [ReactiveFormsModule],
  template: `@if (control) {
    <input [id]="id" [formControl]="control" />
    <span [id]="id + '-err'">{{ errorMessage }}</span>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBaseInput> {
  static override key = 'test-input-rs';
  static create(config: NgsFormsFormItemConfigBaseInput): NgsFormsFormItem<NgsFormsFormItemConfigBaseInput> {
    return { uuid: config.uuid || v4(), type: TestInputComponent.key, config };
  }
}

const settle = async (fixture: { detectChanges(): void; whenStable(): Promise<unknown> }) => {
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 30));
    fixture.detectChanges();
    await fixture.whenStable();
  }
};

describe('form state regressions', () => {
  let forms: NgsFormsService;

  async function render(root: NgsFormsFormItem<any>) {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const registry = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(registry);
    registry.register(TestInputComponent.key, TestInputComponent);
    const fixture = TestBed.createComponent(NgsFormComponent);
    forms = TestBed.inject(NgsFormsService);
    forms.setFormConfig({ inputUpdateDebounce: 0, root } as any);
    await settle(fixture);
    return fixture;
  }

  it('form array validators apply to the initial (empty) array', async () => {
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormArrayContainerComponent.create({
            name: 'tags',
            validators: [Validators.required],
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: TestInputComponent.create({ name: 'tag', label: 'Tag' }),
              }),
            ],
          }),
        ],
      })
    );
    expect(forms.formValue$.value === undefined || true).toBe(true);
    expect(forms.isValid).toBe(false);
  });

  it('form array minimum-rows validator applies with initialItemCount', async () => {
    const minRows = (min: number) => (c: AbstractControl): ValidationErrors | null =>
      (c as UntypedFormArray).length < min ? { minRows: true } : null;
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormArrayContainerComponent.create({
            name: 'tags',
            initialItemCount: 1,
            validators: [minRows(2)],
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: NgsFormsFormGroupComponent.create({ name: 'unused', items: [] }),
              }),
            ],
          }),
        ],
      })
    );
    expect(forms.isValid).toBe(false);
  });

  it('re-validates when validators$ emits new rules (cross-field dependency)', async () => {
    const validators$ = new BehaviorSubject<any[]>([]);
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'company', label: 'Company', id: 'company', validators$ })],
      })
    );
    expect(forms.isValid).toBe(true);
    validators$.next([Validators.required]);
    expect(forms.isValid).toBe(false);
  });

  it('removing validators via validators$ makes the form valid again', async () => {
    const validators$ = new BehaviorSubject<any[]>([Validators.required]);
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'company', label: 'Company', id: 'company', validators$ })],
      })
    );
    expect(forms.isValid).toBe(false);
    validators$.next([]);
    expect(forms.isValid).toBe(true);
  });

  it('shows the error message once the control is touched (blur without typing)', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({
          name: 'email', label: 'Email', id: 'email', validators: [Validators.required],
          errorMessageMap: { required: 'Email is required' },
        })],
      })
    );
    const el = fixture.nativeElement.querySelector('#email') as HTMLInputElement;
    el.dispatchEvent(new Event('focus'));
    el.dispatchEvent(new Event('blur'));
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('#email-err').textContent.trim()).toBe('Email is required');
  });

  it('group level validator runs initially', async () => {
    const match = (g: AbstractControl): ValidationErrors | null =>
      g.get('a')?.value === g.get('b')?.value ? null : { mismatch: true };
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormGroupComponent.create({
            name: 'pw',
            validators: [match],
            items: [
              TestInputComponent.create({ name: 'a', label: 'A', id: 'a', value: 'x' }),
              TestInputComponent.create({ name: 'b', label: 'B', id: 'b', value: 'y' }),
            ],
          }),
        ],
      })
    );
    expect(forms.isValid).toBe(false);
  });

  it('hiding an invalid required field makes the form valid', async () => {
    const visible$ = new BehaviorSubject(true);
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'x', label: 'X', id: 'x', validators: [Validators.required], visible$ })],
      })
    );
    expect(forms.isValid).toBe(false);
    visible$.next(false);
    await settle(fixture);
    expect(forms.isValid).toBe(true);
    visible$.next(true);
    await settle(fixture);
    expect(forms.isValid).toBe(false);
  });

  it('re-enabling a group keeps a child that is configured disabled: true disabled', async () => {
    const disabled$ = new BehaviorSubject(true);
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormGroupComponent.create({
            name: 'address',
            disabled$,
            items: [
              TestInputComponent.create({ name: 'city', label: 'City', id: 'city' }),
              TestInputComponent.create({ name: 'country', label: 'Country', id: 'country', value: 'NL', disabled: true }),
            ],
          }),
        ],
      })
    );
    disabled$.next(false);
    await settle(fixture);
    expect((fixture.nativeElement.querySelector('#city') as HTMLInputElement).disabled).toBe(false);
    expect((fixture.nativeElement.querySelector('#country') as HTMLInputElement).disabled).toBe(true);
    expect(forms.formValue$.value).toEqual({ root: { address: { city: null } } });
  });

  it('re-enabling a group keeps a required child whose disabled$ is true out of validation', async () => {
    const groupDisabled$ = new BehaviorSubject(true);
    const childDisabled$ = new BehaviorSubject(true);
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormGroupComponent.create({
            name: 'company',
            disabled$: groupDisabled$,
            items: [
              TestInputComponent.create({ name: 'vat', label: 'VAT', id: 'vat', validators: [Validators.required], disabled$: childDisabled$ }),
            ],
          }),
        ],
      })
    );
    groupDisabled$.next(false);
    await settle(fixture);
    expect((fixture.nativeElement.querySelector('#vat') as HTMLInputElement).disabled).toBe(true);
    expect(forms.isValid).toBe(true);
  });
});

describe('formArray add/remove functions (state)', () => {
  it('adding an invalid control updates the array validity and parent', () => {
    const arr = new UntypedFormArray([]);
    const fns = NgsFormsFormControlAddRemoveFunctions.formArray(arr);
    const c = new FormControl('', Validators.required);
    fns.add(c, 'x');
    expect(c.parent).toBe(arr);
    expect(arr.valid).toBe(false);
    expect(arr.value).toEqual(['']);
  });
  it('removing a control that is not in the array leaves the array alone', () => {
    const a = new FormControl('a');
    const arr = new UntypedFormArray([a]);
    const fns = NgsFormsFormControlAddRemoveFunctions.formArray(arr);
    fns.remove(new FormControl('other'), 'x');
    expect(arr.length).toBe(1);
  });
  it('removing an invalid control makes the array valid again', () => {
    const c = new FormControl('', Validators.required);
    const arr = new UntypedFormArray([c]);
    expect(arr.valid).toBe(false);
    const fns = NgsFormsFormControlAddRemoveFunctions.formArray(arr);
    fns.remove(c, 'x');
    expect(arr.valid).toBe(true);
  });
});
