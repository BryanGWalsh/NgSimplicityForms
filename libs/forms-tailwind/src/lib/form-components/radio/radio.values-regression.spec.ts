import { TestBed } from '@angular/core/testing';
import { NgsFormsTailwindRadioInputComponent } from './radio.component';
import { NgsFormsTailwindFormItemSelectInputComponent } from '../select/select.component';
import { tailwindTestProviders } from '../../testing/test-providers';

function setup(component: any, config: any) {
  TestBed.configureTestingModule({ imports: [component], providers: tailwindTestProviders(config).providers });
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture as any;
}

describe('tailwind option values with numeric ids', () => {
  const options = [{ id: 1, label: 'One' }, { id: 2, label: 'Two' }];

  it('radio: initial numeric value checks the matching radio', () => {
    const fixture = setup(NgsFormsTailwindRadioInputComponent, { name: 'n', label: 'N', options, value: 2 });
    fixture.detectChanges();
    const radios: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input[type=radio]'));
    expect(radios.map((r) => r.checked)).toEqual([false, true]);
  });

  it('radio: choosing an option keeps the numeric id type', () => {
    const fixture = setup(NgsFormsTailwindRadioInputComponent, { name: 'n', label: 'N', options });
    const radios: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input[type=radio]'));
    radios[1].click();
    expect(fixture.componentInstance.control.value).toBe(2);
  });

  it('select: choosing an option keeps the numeric id type', () => {
    const fixture = setup(NgsFormsTailwindFormItemSelectInputComponent, { name: 'n', label: 'N', options });
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.selectedIndex = Array.from(select.options).findIndex((o) => o.textContent?.trim() === options.find((x) => x.id === 2)!.label);
    select.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.control.value).toBe(2);
  });
});
