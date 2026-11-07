import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatChipGridHarness, MatChipInputHarness } from '@angular/material/chips/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService, NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialFormItemToggleComponent } from './toggle';
import { NgsFormsMaterialFormItemButtonGroupComponent } from './button-group';
import { NgsFormsMaterialFormItemRangeComponent } from './range';
import { NgsFormsMaterialFormItemTypeaheadComponent } from './typeahead';
import { NgsFormsMaterialFormItemDatepickerComponent } from './datepicker';
import { NgsFormsMaterialFormItemChipsComponent } from './chips';
import { NgsFormsMaterialModule } from '../forms-material.module';

function create<T>(cmp: Type<T>, config: object) {
  const submitted$ = new BehaviorSubject(false);
  const providers: Provider[] = [
    provideNoopAnimations(),
    { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
    { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: { add: jest.fn(), remove: jest.fn() } },
    { provide: NgsFormsInternalService, useValue: { isSubmitted$: submitted$, subscribeToState: jest.fn().mockReturnValue(of({})) } },
    { provide: NgsFormsService, useValue: {} },
  ];
  TestBed.configureTestingModule({ imports: [cmp], providers });
  const fixture = TestBed.createComponent(cmp);
  fixture.detectChanges();
  const loader = TestbedHarnessEnvironment.loader(fixture);
  return { fixture, submitted$, loader, el: fixture.nativeElement as HTMLElement, cmp: fixture.componentInstance as any };
}

const OPTIONS = [{ id: 'a', label: 'Apple' }, { id: 'b', label: 'Banana' }, { id: 3, label: 'Cherry' }];

describe('Material toggle', () => {
  it('toggles the value and flags errors on the switch', async () => {
    const { loader, cmp, fixture, el, submitted$ } = create(NgsFormsMaterialFormItemToggleComponent, {
      name: 't', label: 'Dark mode', validators: [Validators.requiredTrue], errorMessageMap: { required: 'Turn it on' },
    });
    const toggle = await loader.getHarness(MatSlideToggleHarness);
    expect(await toggle.getLabelText()).toBe('Dark mode');
    submitted$.next(true);
    fixture.detectChanges();
    expect(el.querySelector('[role=switch]')!.getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelector('[aria-live] [id$="-error"]')!.textContent!.trim()).toBe('Turn it on');
    await toggle.toggle();
    expect(cmp.control.value).toBe(true);
    fixture.detectChanges();
    expect(el.querySelector('[role=switch]')!.hasAttribute('aria-invalid')).toBe(false);
  });
});

describe('Material button group', () => {
  it('single choice: value is the chosen option id', async () => {
    const { loader, cmp } = create(NgsFormsMaterialFormItemButtonGroupComponent, { name: 'g', label: 'Fruit', options: OPTIONS });
    const group = await loader.getHarness(MatButtonToggleGroupHarness);
    const toggles = await group.getToggles();
    expect(toggles.length).toBe(3);
    await toggles[2].check();
    expect(cmp.control.value).toBe(3);
    await toggles[0].check();
    expect(cmp.control.value).toBe('a');
    expect(await toggles[2].isChecked()).toBe(false);
  });

  it('multiple: value is an array of ids, and a patched value checks the toggles', async () => {
    const { loader, cmp, fixture } = create(NgsFormsMaterialFormItemButtonGroupComponent, { name: 'g', label: 'Fruit', options: OPTIONS, multiple: true });
    const toggles = await (await loader.getHarness(MatButtonToggleGroupHarness)).getToggles();
    await toggles[1].check();
    await toggles[0].check();
    expect(cmp.control.value).toEqual(['a', 'b']);
    cmp.control.setValue([3]);
    fixture.detectChanges();
    expect(await Promise.all(toggles.map((t) => t.isChecked()))).toEqual([false, false, true]);
  });
});

describe('Material range', () => {
  it('starts at min and follows the slider', async () => {
    const { loader, cmp, fixture, el } = create(NgsFormsMaterialFormItemRangeComponent, { name: 'r', label: 'Volume', min: 10, max: 50, step: 5, valueSuffix: '%' });
    expect(cmp.control.value).toBe(10);
    const slider = await loader.getHarness(MatSliderHarness);
    expect(await slider.getMinValue()).toBe(10);
    expect(await slider.getMaxValue()).toBe(50);
    const thumb = await slider.getEndThumb();
    await thumb.setValue(30);
    expect(cmp.control.value).toBe(30);
    fixture.detectChanges();
    expect(el.querySelector('output')!.textContent!.trim()).toBe('30%');
  });
});

describe('Material typeahead', () => {
  it('filters suggestions by the typed text and writes the chosen label', async () => {
    const { loader, cmp } = create(NgsFormsMaterialFormItemTypeaheadComponent, { name: 'c', label: 'Fruit', options: OPTIONS });
    const auto = await loader.getHarness(MatAutocompleteHarness);
    await auto.enterText('an');
    const options = await auto.getOptions();
    expect(await Promise.all(options.map((o) => o.getText()))).toEqual(['Banana']);
    await auto.selectOption({ text: 'Banana' });
    expect(cmp.control.value).toBe('Banana');
  });

  it('keeps free text and lists every suggestion when filter is off', async () => {
    const { loader, cmp } = create(NgsFormsMaterialFormItemTypeaheadComponent, { name: 'c', label: 'Fruit', options: OPTIONS, filter: false });
    const auto = await loader.getHarness(MatAutocompleteHarness);
    await auto.enterText('zz');
    expect((await auto.getOptions()).length).toBe(3);
    expect(cmp.control.value).toBe('zz');
  });
});

describe('Material datepicker', () => {
  it('parses typed dates into Date values and reports min errors', async () => {
    const { loader, cmp, fixture, el } = create(NgsFormsMaterialFormItemDatepickerComponent, {
      name: 'd', label: 'Start date', min: new Date(2026, 0, 1), errorMessageMap: { matDatepickerMin: 'Too early' },
    });
    const input = await loader.getHarness(MatDatepickerInputHarness);
    await input.setValue('3/15/2026');
    expect(cmp.control.value).toBeInstanceOf(Date);
    expect((cmp.control.value as Date).getFullYear()).toBe(2026);
    await input.setValue('3/15/2025');
    await input.blur();
    fixture.detectChanges();
    expect(cmp.control.errors?.['matDatepickerMin']).toBeTruthy();
    expect(el.querySelector('mat-error')!.textContent!.trim()).toBe('Too early');
    expect(await input.hasCalendar()).toBe(true);
  });
});

describe('Material chips', () => {
  it('adds chips on Enter, skips duplicates and removes chips', async () => {
    const { loader, cmp } = create(NgsFormsMaterialFormItemChipsComponent, { name: 'tags', label: 'Tags', placeholder: 'Add a tag' });
    const grid = await loader.getHarness(MatChipGridHarness);
    const input = await loader.getHarness(MatChipInputHarness);
    await input!.setValue('angular');
    await input!.sendSeparatorKey(TestKey.ENTER);
    await input!.setValue('forms');
    await input!.sendSeparatorKey(TestKey.ENTER);
    await input!.setValue('angular');
    await input!.sendSeparatorKey(TestKey.ENTER);
    expect(cmp.control.value).toEqual(['angular', 'forms']);
    const rows = await grid.getRows();
    expect(await Promise.all(rows.map((r) => r.getText()))).toEqual([expect.stringContaining('angular'), expect.stringContaining('forms')]);
    await rows[0].remove();
    expect(cmp.control.value).toEqual(['forms']);
  });
});

describe('Material registration', () => {
  it('registerAllMaterialComponents registers the new keys', () => {
    const registry = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsMaterialModule.registerAllMaterialComponents(registry);
    expect(registry.getComponentTypeForKey('toggle')).toBe(NgsFormsMaterialFormItemToggleComponent);
    expect(registry.getComponentTypeForKey('button-group')).toBe(NgsFormsMaterialFormItemButtonGroupComponent);
    expect(registry.getComponentTypeForKey('range')).toBe(NgsFormsMaterialFormItemRangeComponent);
    expect(registry.getComponentTypeForKey('typeahead')).toBe(NgsFormsMaterialFormItemTypeaheadComponent);
    expect(registry.getComponentTypeForKey('datepicker')).toBe(NgsFormsMaterialFormItemDatepickerComponent);
    expect(registry.getComponentTypeForKey('chips')).toBe(NgsFormsMaterialFormItemChipsComponent);
  });
});
