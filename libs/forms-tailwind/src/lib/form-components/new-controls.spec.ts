import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService, NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsTailwindFormItemToggleComponent } from './toggle';
import { NgsFormsTailwindFormItemButtonGroupComponent } from './button-group';
import { NgsFormsTailwindFormItemRangeComponent } from './range';
import { NgsFormsTailwindFormItemTypeaheadComponent } from './typeahead';
import { NgsFormsTailwindModule } from '../forms-tailwind.module';

function create<T>(cmp: Type<T>, config: object) {
  const submitted$ = new BehaviorSubject(false);
  const providers: Provider[] = [
    { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
    { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: { add: jest.fn(), remove: jest.fn() } },
    { provide: NgsFormsInternalService, useValue: { isSubmitted$: submitted$, subscribeToState: jest.fn().mockReturnValue(of({})) } },
    { provide: NgsFormsService, useValue: {} },
  ];
  TestBed.configureTestingModule({ imports: [cmp], providers });
  const fixture = TestBed.createComponent(cmp);
  fixture.detectChanges();
  return { fixture, submitted$, el: fixture.nativeElement as HTMLElement, cmp: fixture.componentInstance as any };
}

const OPTIONS = [{ id: 'a', label: 'Apple' }, { id: 'b', label: 'Banana' }, { id: 3, label: 'Cherry', disabled: true }];

describe('Tailwind toggle', () => {
  it('renders a switch whose value follows the checkbox', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemToggleComponent, { name: 't', label: 'Dark mode' });
    const input = el.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('switch');
    expect(el.querySelector('label')!.textContent!.trim()).toBe('Dark mode');
    expect(el.querySelector('label')!.getAttribute('for')).toBe(input.id);
    input.click();
    fixture.detectChanges();
    expect(cmp.control.value).toBe(true);
  });

  it('create() uses the toggle key', () => {
    expect(NgsFormsTailwindFormItemToggleComponent.create({ name: 'x', label: 'X' }).type).toBe('toggle');
  });
});

describe('Tailwind button group', () => {
  it('single choice: value is the clicked option id and the radio is checked', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemButtonGroupComponent, { name: 'g', label: 'Fruit', options: OPTIONS });
    const inputs = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    expect(inputs.map((i) => i.type)).toEqual(['radio', 'radio', 'radio']);
    expect(el.querySelector('[role=radiogroup]')!.getAttribute('aria-labelledby')).toBe(`${cmp.id}-label`);
    inputs[1].click();
    fixture.detectChanges();
    expect(cmp.control.value).toBe('b');
    expect(inputs[1].checked).toBe(true);
    inputs[0].click();
    fixture.detectChanges();
    expect(cmp.control.value).toBe('a');
    expect(inputs[2].disabled).toBe(true);
  });

  it('multiple: value is an array of ids in option order', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemButtonGroupComponent, {
      name: 'g', label: 'Fruit', multiple: true, options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 3, label: 'C' }],
    });
    const inputs = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    expect(inputs[0].type).toBe('checkbox');
    inputs[2].click();
    inputs[0].click();
    fixture.detectChanges();
    expect(cmp.control.value).toEqual(['a', 3]);
    inputs[2].click();
    fixture.detectChanges();
    expect(cmp.control.value).toEqual(['a']);
  });

  it('reflects a patched value and the disabled state', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemButtonGroupComponent, { name: 'g', label: 'Fruit', options: OPTIONS });
    cmp.control.setValue('b');
    cmp.control.disable();
    fixture.detectChanges();
    const inputs = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    expect(inputs[1].checked).toBe(true);
    expect(inputs.every((i) => i.disabled)).toBe(true);
  });

  it('shows the required error after submit, on a live region', () => {
    const { el, fixture, submitted$ } = create(NgsFormsTailwindFormItemButtonGroupComponent, {
      name: 'g', label: 'Fruit', options: OPTIONS, validators: [Validators.required], errorMessageMap: { required: 'Pick one' },
    });
    submitted$.next(true);
    fixture.detectChanges();
    expect(el.querySelector('[aria-live] [id$="-error"]')!.textContent!.trim()).toBe('Pick one');
    expect(el.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('[role=radiogroup]')!.getAttribute('aria-required')).toBe('true');
  });
});

describe('Tailwind range', () => {
  it('starts at min, keeps numbers and shows the value with its suffix', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemRangeComponent, { name: 'r', label: 'Volume', min: 10, max: 50, step: 5, valueSuffix: '%' });
    const input = el.querySelector('input')!;
    expect(cmp.control.value).toBe(10);
    expect(input.min).toBe('10');
    expect(input.max).toBe('50');
    expect(input.step).toBe('5');
    input.value = '35';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(cmp.control.value).toBe(35);
    expect(el.querySelector('output')!.textContent!.trim()).toBe('35%');
    expect(input.getAttribute('aria-valuetext')).toBe('35%');
  });

  it('keeps a configured value', () => {
    const { cmp } = create(NgsFormsTailwindFormItemRangeComponent, { name: 'r', label: 'Volume', value: 70 });
    expect(cmp.control.value).toBe(70);
  });
});

describe('Tailwind typeahead', () => {
  it('lists enabled option labels in a datalist tied to the input', () => {
    const { el, cmp, fixture } = create(NgsFormsTailwindFormItemTypeaheadComponent, { name: 'c', label: 'City', options: OPTIONS, placeholder: 'Start typing' });
    const input = el.querySelector('input')!;
    const list = el.querySelector('datalist')!;
    expect(input.getAttribute('list')).toBe(list.id);
    expect(input.placeholder).toBe('Start typing');
    expect(Array.from(list.querySelectorAll('option')).map((o) => o.value)).toEqual(['Apple', 'Banana']);
    input.value = 'Banana';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(cmp.control.value).toBe('Banana');
  });
});

describe('Tailwind registration', () => {
  it('registerAllTailwindComponents registers the new keys', () => {
    const registry = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsTailwindModule.registerAllTailwindComponents(registry);
    expect(registry.getComponentTypeForKey('toggle')).toBe(NgsFormsTailwindFormItemToggleComponent);
    expect(registry.getComponentTypeForKey('button-group')).toBe(NgsFormsTailwindFormItemButtonGroupComponent);
    expect(registry.getComponentTypeForKey('range')).toBe(NgsFormsTailwindFormItemRangeComponent);
    expect(registry.getComponentTypeForKey('typeahead')).toBe(NgsFormsTailwindFormItemTypeaheadComponent);
  });
});
