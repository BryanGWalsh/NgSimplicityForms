import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NgsFormsTailwindRadioInputComponent } from './radio.component';
import { hasClasses, tailwindTestProviders } from '../../testing/test-providers';
import { NGS_FORMS_TAILWIND_DEFAULT_CLASSES } from '../../forms-tailwind.classes';

const OPTIONS = [
  { id: 's', label: 'Small' },
  { id: 'l', label: 'Large' },
];

describe('NgsFormsTailwindRadioInputComponent', () => {
  function create(config: object) {
    const setup = tailwindTestProviders(config);
    TestBed.configureTestingModule({ imports: [NgsFormsTailwindRadioInputComponent], providers: setup.providers });
    const fixture = TestBed.createComponent(NgsFormsTailwindRadioInputComponent);
    fixture.detectChanges();
    return { fixture, setup, el: fixture.nativeElement as HTMLElement };
  }

  it('renders one radio per option inside a labelled radiogroup', () => {
    const { el } = create({ name: 'size', label: 'Size', options: OPTIONS });
    const group = el.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('aria-labelledby')).toBe(el.querySelector('[id$="-label"]')!.id);
    const radios = el.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios.length).toBe(2);
    expect(el.querySelector(`label[for="${radios[1].id}"]`)!.textContent?.trim()).toBe('Large');
    expect(hasClasses(group.firstElementChild!, NGS_FORMS_TAILWIND_DEFAULT_CLASSES.radioOptions)).toBe(true);
  });

  it('uses the horizontal classes for alignment horizontal', () => {
    const { el } = create({ name: 'size', options: OPTIONS, alignment: 'horizontal' });
    expect(hasClasses(el.querySelector('[role="radiogroup"]')!.firstElementChild!, NGS_FORMS_TAILWIND_DEFAULT_CLASSES.radioOptionsHorizontal)).toBe(true);
  });

  it('updates the control when an option is clicked', () => {
    const { el, fixture } = create({ name: 'size', options: OPTIONS });
    el.querySelectorAll<HTMLInputElement>('input')[1].click();
    expect(fixture.componentInstance.control?.value).toBe('l');
  });

  it('shows errors after submit', () => {
    const { el, fixture, setup } = create({ name: 'size', options: OPTIONS, validators: [Validators.required], errorMessageMap: { required: 'Pick a size.' } });
    setup.submitted$.next(true);
    fixture.detectChanges();
    const error = el.querySelector('p')!;
    expect(error.textContent?.trim()).toBe('Pick a size.');
    expect(el.querySelector('[role="radiogroup"]')!.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('creates a radio item', () => {
    expect(NgsFormsTailwindRadioInputComponent.create({ name: 'size', label: 'L' }).type).toBe('radio');
  });
});
