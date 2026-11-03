import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'test-input',
  imports: [ReactiveFormsModule],
  template: `@if (control) { <input [id]="id" [formControl]="control" /> }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBaseInput> {
  static override key = 'test-input';
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

describe('form item options', () => {
  let forms: NgsFormsService;

  async function render(root: NgsFormsFormItem<any>) {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const registry = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(registry);
    registry.register(TestInputComponent.key, TestInputComponent);
    const fixture = TestBed.createComponent(NgsFormComponent);
    forms = TestBed.inject(NgsFormsService);
    forms.setFormConfig({ globalState: {}, inputUpdateDebounce: 0, root });
    await settle(fixture);
    return fixture;
  }

  const input = (el: HTMLElement, id: string) => el.querySelector<HTMLInputElement>(`#${id}`);

  it('seeds the control with value and uses the configured id', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'first', label: 'First', id: 'first-name', value: 'Ada' })],
      })
    );
    const el = input(fixture.nativeElement, 'first-name');
    expect(el).toBeTruthy();
    expect(el!.value).toBe('Ada');
    expect(forms.formValue$.value).toEqual({ root: { first: 'Ada' } });
  });

  it('does not render an item with visible: false', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          TestInputComponent.create({ name: 'shown', label: 'Shown', id: 'shown' }),
          TestInputComponent.create({ name: 'hidden', label: 'Hidden', id: 'hidden', visible: false }),
        ],
      })
    );
    expect(input(fixture.nativeElement, 'shown')).toBeTruthy();
    expect(input(fixture.nativeElement, 'hidden')).toBeNull();
  });

  it('disables an input with disabled: true', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'locked', label: 'Locked', id: 'locked', disabled: true })],
      })
    );
    expect(input(fixture.nativeElement, 'locked')!.disabled).toBe(true);
  });

  it('follows disabled$', async () => {
    const disabled$ = new BehaviorSubject(true);
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'toggle', label: 'Toggle', id: 'toggle', disabled$ })],
      })
    );
    expect(input(fixture.nativeElement, 'toggle')!.disabled).toBe(true);
    disabled$.next(false);
    await settle(fixture);
    expect(input(fixture.nativeElement, 'toggle')!.disabled).toBe(false);
  });

  it('disables every control inside a disabled group, including ones added later', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormGroupComponent.create({
            name: 'address',
            disabled: true,
            items: [
              TestInputComponent.create({ name: 'city', label: 'City', id: 'city' }),
              TestInputComponent.create({ name: 'zip', label: 'Zip', id: 'zip' }),
            ],
          }),
        ],
      })
    );
    expect(input(fixture.nativeElement, 'city')!.disabled).toBe(true);
    expect(input(fixture.nativeElement, 'zip')!.disabled).toBe(true);
  });

  it('disables the rows of a disabled form array', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormArrayContainerComponent.create({
            name: 'people',
            disabled: true,
            initialItemCount: 2,
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: TestInputComponent.create({ name: 'person', label: 'Person' }),
              }),
            ],
          }),
        ],
      })
    );
    const inputs = Array.from(fixture.nativeElement.querySelectorAll('input')) as HTMLInputElement[];
    expect(inputs.length).toBe(2);
    expect(inputs.every((i) => i.disabled)).toBe(true);
  });
});
