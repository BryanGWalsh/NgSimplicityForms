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
  template: `@if (control) {
    <input [id]="id" [formControl]="control" />
    <span [id]="id + '-mode'">{{ commonState().displayMode ?? 'input' }}</span>
    <span [id]="id + '-toggle'">{{ commonState().showEditToggle ? 'toggle' : 'no-toggle' }}</span>
    <button type="button" [id]="id + '-flip'" (click)="toggleDisplayMode()">flip</button>
  }`,
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

  async function render(root: NgsFormsFormItem<any>, globalState: any = {}, initialState?: any) {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const registry = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(registry);
    registry.register(TestInputComponent.key, TestInputComponent);
    const fixture = TestBed.createComponent(NgsFormComponent);
    forms = TestBed.inject(NgsFormsService);
    forms.setFormConfig({ globalState, inputUpdateDebounce: 0, root, initialState });
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

  it('prefers visible$ over visible', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'a', label: 'A', id: 'a', visible: false, visible$: new BehaviorSubject(true) })],
      })
    );
    expect(input(fixture.nativeElement, 'a')).toBeTruthy();
  });

  it('prefers disabled$ over disabled', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [TestInputComponent.create({ name: 'a', label: 'A', id: 'a', disabled: true, disabled$: new BehaviorSubject(false) })],
      })
    );
    expect(input(fixture.nativeElement, 'a')!.disabled).toBe(false);
  });

  it('leaves disabled controls out of the form value', async () => {
    await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          TestInputComponent.create({ name: 'kept', label: 'Kept', value: 'x' }),
          TestInputComponent.create({ name: 'dropped', label: 'Dropped', value: 'y', disabled: true }),
        ],
      })
    );
    expect(forms.formValue$.value).toEqual({ root: { kept: 'x' } });
  });

  it('re-enables a group and its children when disabled$ emits false', async () => {
    const disabled$ = new BehaviorSubject(true);
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormGroupComponent.create({
            name: 'address',
            disabled$,
            items: [TestInputComponent.create({ name: 'city', label: 'City', id: 'city' })],
          }),
        ],
      })
    );
    expect(input(fixture.nativeElement, 'city')!.disabled).toBe(true);
    disabled$.next(false);
    await settle(fixture);
    expect(input(fixture.nativeElement, 'city')!.disabled).toBe(false);
    disabled$.next(true);
    await settle(fixture);
    expect(input(fixture.nativeElement, 'city')!.disabled).toBe(true);
  });

  const text = (el: HTMLElement, id: string) => el.querySelector(`#${id}`)?.textContent?.trim();

  it('seeds component state from globalState, form initialState and item initialState', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          TestInputComponent.create({ name: 'a', label: 'A', id: 'a' }),
          TestInputComponent.create({ name: 'b', label: 'B', id: 'b' }),
          TestInputComponent.create({ name: 'c', label: 'C', id: 'c', initialState: { displayMode: 'input' } }),
        ],
      }),
      { displayMode: 'summary', showEditToggle: true },
      { b: { showEditToggle: false } }
    );
    const el = fixture.nativeElement as HTMLElement;
    expect(text(el, 'a-mode')).toBe('summary');
    expect(text(el, 'a-toggle')).toBe('toggle');
    expect(text(el, 'b-mode')).toBe('summary');
    expect(text(el, 'b-toggle')).toBe('no-toggle');
    expect(text(el, 'c-mode')).toBe('input');
    expect(text(el, 'c-toggle')).toBe('toggle');
  });

  it('toggleDisplayMode() flips only its own component', async () => {
    const fixture = await render(
      NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          TestInputComponent.create({ name: 'a', label: 'A', id: 'a' }),
          TestInputComponent.create({ name: 'b', label: 'B', id: 'b' }),
        ],
      }),
      { displayMode: 'summary' }
    );
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('#a-flip') as HTMLButtonElement).click();
    await settle(fixture);
    expect(text(el, 'a-mode')).toBe('input');
    expect(text(el, 'b-mode')).toBe('summary');
    (el.querySelector('#a-flip') as HTMLButtonElement).click();
    await settle(fixture);
    expect(text(el, 'a-mode')).toBe('summary');
  });

  it('resets state when setFormConfig is called again', async () => {
    const root = () =>
      NgsFormsFormGroupComponent.create({ name: 'root', items: [TestInputComponent.create({ name: 'a', label: 'A', id: 'a' })] });
    const fixture = await render(root(), { displayMode: 'summary' });
    forms.updateGlobalState({ displayMode: 'input' });
    await settle(fixture);
    expect(text(fixture.nativeElement, 'a-mode')).toBe('input');
    forms.setFormConfig({ globalState: { displayMode: 'summary' }, inputUpdateDebounce: 0, root: root() });
    await settle(fixture);
    expect(text(fixture.nativeElement, 'a-mode')).toBe('summary');
  });
});
