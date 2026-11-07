import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { NgsFormsMaterialFormItemInputComponent } from './input/input.component';
import { NgsFormsMaterialFormItemSelectInputComponent } from './select/select.component';
import { NgsFormsMaterialFormItemTextAreaComponent } from './text-area/text-area.component';
import { NgsFormsMaterialFormItemCheckboxComponent } from './checkbox/checkbox.component';
import { NgsFormsMaterialRadioInputComponent } from './radio/radio.component';

function create(cmp: Type<unknown>, config: object) {
  const submitted$ = new BehaviorSubject(false);
  const providers: Provider[] = [
    { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
    { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: { add: jest.fn(), remove: jest.fn() } },
    { provide: NgsFormsInternalService, useValue: { isSubmitted$: submitted$, subscribeToState: jest.fn().mockReturnValue(of({})) } },
    { provide: NgsFormsService, useValue: {} },
  ];
  TestBed.configureTestingModule({ imports: [cmp, NoopAnimationsModule], providers });
  const fixture = TestBed.createComponent(cmp);
  fixture.detectChanges();
  return { fixture, submitted$, el: fixture.nativeElement as HTMLElement };
}

const OPTIONS = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];
const required = { name: 'f', label: 'Field', validators: [Validators.required], errorMessageMap: { required: 'Required!' } };

describe('material a11y regressions', () => {
  // sanity: mat-form-field based controls are fine
  it.each([
    ['input', NgsFormsMaterialFormItemInputComponent, 'input'],
    ['textarea', NgsFormsMaterialFormItemTextAreaComponent, 'textarea'],
    ['select', NgsFormsMaterialFormItemSelectInputComponent, 'mat-select'],
  ])('[%s] sanity: aria-required + live error', (_n, cmp, sel) => {
    const { el, fixture, submitted$ } = create(cmp as Type<unknown>, { ...required, options: OPTIONS });
    submitted$.next(true);
    fixture.detectChanges();
    const c = el.querySelector(sel as string)!;
    // matInput intentionally omits aria-invalid for empty+required, so only check required/live here
    expect(c.getAttribute('aria-required')).toBe('true');
    expect(el.querySelector('mat-error')!.closest('[aria-live]')).not.toBeNull();
  });

  it('[checkbox] invalid checkbox exposes aria-invalid="true" on the native input', () => {
    const { el, fixture, submitted$ } = create(NgsFormsMaterialFormItemCheckboxComponent, { ...required, validators: [Validators.requiredTrue] });
    submitted$.next(true);
    fixture.detectChanges();
    expect(el.textContent).toContain('Required!');
    expect(el.querySelector('input[type=checkbox]')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('[radio] invalid radio group exposes aria-invalid="true"', () => {
    const { el, fixture, submitted$ } = create(NgsFormsMaterialRadioInputComponent, { ...required, options: OPTIONS });
    submitted$.next(true);
    fixture.detectChanges();
    expect(el.textContent).toContain('Required!');
    const group = el.querySelector('mat-radio-group')!;
    const radios = Array.from(el.querySelectorAll('input[type=radio]'));
    const flagged = group.getAttribute('aria-invalid') === 'true' || radios.every((r) => r.getAttribute('aria-invalid') === 'true');
    expect(flagged).toBe(true);
  });

  it.each([
    ['checkbox', NgsFormsMaterialFormItemCheckboxComponent, 'input[type=checkbox]'],
    ['radio', NgsFormsMaterialRadioInputComponent, 'mat-radio-group'],
  ])('[%s] required is exposed (required / aria-required)', (_n, cmp, sel) => {
    const { el } = create(cmp as Type<unknown>, { ...required, options: OPTIONS });
    const c = el.querySelector(sel as string)!;
    const radios = Array.from(el.querySelectorAll('input[type=radio]'));
    const flagged = c.hasAttribute('required') || c.getAttribute('aria-required') === 'true' || (radios.length > 0 && radios.every((r) => r.hasAttribute('required')));
    expect(flagged).toBe(true);
  });

  it.each([
    ['checkbox', NgsFormsMaterialFormItemCheckboxComponent],
    ['radio', NgsFormsMaterialRadioInputComponent],
  ])('[%s] error message is in a live region', (_n, cmp) => {
    const { el, fixture, submitted$ } = create(cmp as Type<unknown>, { ...required, options: OPTIONS });
    submitted$.next(true);
    fixture.detectChanges();
    const err = el.querySelector('[id$="-error"]')!;
    expect(err.textContent).toContain('Required!');
    expect(err.closest('[role=alert],[aria-live],[role=status]')).not.toBeNull();
  });
});
