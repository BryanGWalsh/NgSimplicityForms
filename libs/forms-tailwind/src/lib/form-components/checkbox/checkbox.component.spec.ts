import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NgsFormsTailwindFormItemCheckboxComponent } from './checkbox.component';
import { tailwindTestProviders } from '../../testing/test-providers';

describe('NgsFormsTailwindFormItemCheckboxComponent', () => {
  function create(config: object) {
    const setup = tailwindTestProviders(config);
    TestBed.configureTestingModule({ imports: [NgsFormsTailwindFormItemCheckboxComponent], providers: setup.providers });
    const fixture = TestBed.createComponent(NgsFormsTailwindFormItemCheckboxComponent);
    fixture.detectChanges();
    return { fixture, setup, el: fixture.nativeElement as HTMLElement };
  }

  it('renders a labelled checkbox that toggles the value', () => {
    const { el, fixture } = create({ name: 'agree', label: 'I agree' });
    const input = el.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(el.querySelector('label')!.getAttribute('for')).toBe(input.id);
    expect(el.querySelector('label')!.textContent?.trim()).toBe('I agree');
    input.click();
    expect(fixture.componentInstance.control?.value).toBe(true);
  });

  it('shows the requiredTrue error after submit', () => {
    const { el, fixture, setup } = create({ name: 'agree', validators: [Validators.requiredTrue], errorMessageMap: { required: 'Please agree.' } });
    setup.submitted$.next(true);
    fixture.detectChanges();
    expect(el.querySelector('p')!.textContent?.trim()).toBe('Please agree.');
    expect(el.querySelector('input')!.className).toContain('outline-red-500');
  });

  it('creates a checkbox item', () => {
    expect(NgsFormsTailwindFormItemCheckboxComponent.create({ name: 'agree', label: 'L' }).type).toBe('checkbox');
  });
});
