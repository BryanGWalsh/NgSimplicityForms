import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { NgsFormsBootstrapFormItemInputComponent } from './input/input.component';
import { NgsFormsBootstrapFormItemSelectInputComponent } from './select/select.component';
import { NgsFormsBootstrapFormsItemTextAreaComponent } from './text-area/text-area.component';
import { NgsFormsBootstrapFormsItemCheckboxComponent } from './checkbox/checkbox.component';
import { NgsFormsBootstrapRadioInputComponent } from './radio/radio.component';

function create(cmp: Type<unknown>, config: object) {
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
  return { fixture, submitted$, el: fixture.nativeElement as HTMLElement };
}

const OPTIONS = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }];
const cases: Array<[string, Type<unknown>, string, object]> = [
  ['input', NgsFormsBootstrapFormItemInputComponent, 'input', {}],
  ['select', NgsFormsBootstrapFormItemSelectInputComponent, 'select', { options: OPTIONS, labelLocation: 'top' }],
  ['textarea', NgsFormsBootstrapFormsItemTextAreaComponent, 'textarea', {}],
  ['checkbox', NgsFormsBootstrapFormsItemCheckboxComponent, 'input[type=checkbox]', {}],
  ['radio', NgsFormsBootstrapRadioInputComponent, 'input[type=radio]', { options: OPTIONS }],
];

describe('bootstrap a11y regressions', () => {
  for (const [name, cmp, sel, extra] of cases) {
    it(`[${name}] invalid control (error shown) exposes aria-invalid="true"`, () => {
      const { el, fixture, submitted$ } = create(cmp, { name: 'f', label: 'Field', validators: [Validators.required], errorMessageMap: { required: 'Required!' }, ...extra });
      submitted$.next(true);
      fixture.detectChanges();
      expect(el.textContent).toContain('Required!');
      const controls = Array.from(el.querySelectorAll(sel));
      expect(controls.length).toBeGreaterThan(0);
      expect(controls.map((c) => c.getAttribute('aria-invalid'))).toEqual(controls.map(() => 'true'));
    });

    it(`[${name}] required control exposes required / aria-required`, () => {
      const { el } = create(cmp, { name: 'f', label: 'Field', validators: [Validators.required], ...extra });
      const c = el.querySelector(sel)!;
      const group = el.querySelector('[role=radiogroup]');
      const flagged = c.hasAttribute('required') || c.getAttribute('aria-required') === 'true' || group?.getAttribute('aria-required') === 'true';
      expect(flagged).toBe(true);
    });

    it(`[${name}] error message is in a live region so it is announced`, () => {
      const { el, fixture, submitted$ } = create(cmp, { name: 'f', label: 'Field', validators: [Validators.required], errorMessageMap: { required: 'Required!' }, ...extra });
      submitted$.next(true);
      fixture.detectChanges();
      const err = el.querySelector('[id$="-error"]')!;
      expect(err).toBeTruthy();
      const live = err.closest('[role=alert],[aria-live],[role=status]');
      expect(live).not.toBeNull();
    });
  }

  it('[radio] native radios share a non-empty name so the browser groups them (arrow keys, single tab stop)', () => {
    const { el } = create(NgsFormsBootstrapRadioInputComponent, { name: 'size', label: 'Size', options: OPTIONS });
    const names = Array.from(el.querySelectorAll<HTMLInputElement>('input[type=radio]')).map((r) => r.name);
    expect(names[0]).not.toBe('');
    expect(new Set(names).size).toBe(1);
  });
});
