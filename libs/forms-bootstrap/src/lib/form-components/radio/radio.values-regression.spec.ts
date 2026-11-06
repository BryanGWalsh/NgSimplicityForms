import { TestBed } from '@angular/core/testing';
import { NgsFormsBootstrapRadioInputComponent } from './radio.component';
import { NgsFormsBootstrapFormItemSelectInputComponent } from '../select/select.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { of } from 'rxjs';

function setup(component: any, config: any) {
  TestBed.configureTestingModule({
    imports: [component],
    providers: [
      { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
      { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: { add: jest.fn(), remove: jest.fn() } },
      { provide: NgsFormsInternalService, useValue: { isSubmitted$: of(false), subscribeToState: () => of({}) } },
      { provide: NgsFormsService, useValue: {} },
    ],
  });
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture as any;
}

describe('bootstrap option values with numeric ids', () => {
  const options = [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }];

  it('radio: initial numeric value checks the matching radio', () => {
    const fixture = setup(NgsFormsBootstrapRadioInputComponent, { name: 'n', label: 'N', options, value: 2 });
    fixture.detectChanges();
    const radios: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input[type=radio]'));
    expect(radios.map((r) => r.checked)).toEqual([false, true]);
  });

  it('radio: choosing an option keeps the numeric id type', () => {
    const fixture = setup(NgsFormsBootstrapRadioInputComponent, { name: 'n', label: 'N', options });
    const radios: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input[type=radio]'));
    radios[1].click();
    expect(fixture.componentInstance.control.value).toBe(2);
  });

  it('select: choosing an option keeps the numeric id type', () => {
    const fixture = setup(NgsFormsBootstrapFormItemSelectInputComponent, { name: 'n', label: 'N', options, labelLocation: 'top' });
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.selectedIndex = Array.from(select.options).findIndex((o) => o.textContent?.trim() === options.find((x) => x.id === 2)!.label);
    select.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.control.value).toBe(2);
  });
});
