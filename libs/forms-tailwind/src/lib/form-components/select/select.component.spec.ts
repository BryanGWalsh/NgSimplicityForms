import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgsFormsTailwindFormItemSelectInputComponent } from './select.component';
import { tailwindTestProviders } from '../../testing/test-providers';

const OPTIONS = [
  { id: 'us', label: 'United States' },
  { id: 'ca', label: 'Canada', disabled: true },
];

describe('NgsFormsTailwindFormItemSelectInputComponent', () => {
  function create(config: object) {
    const setup = tailwindTestProviders(config);
    TestBed.configureTestingModule({ imports: [NgsFormsTailwindFormItemSelectInputComponent], providers: setup.providers });
    const fixture = TestBed.createComponent(NgsFormsTailwindFormItemSelectInputComponent);
    fixture.detectChanges();
    return { fixture, setup, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the placeholder and options, label on top by default', () => {
    const { el } = create({ name: 'country', label: 'Country', placeholder: 'Choose', options: OPTIONS });
    const select = el.querySelector('select')!;
    expect(select.id).toMatch(/-top$/);
    const options = el.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[0].textContent?.trim()).toBe('Choose');
    expect(options[0].disabled).toBe(true);
    expect(options[2].disabled).toBe(true);
  });

  it('follows options$', () => {
    const options$ = new BehaviorSubject(OPTIONS);
    const { el, fixture } = create({ name: 'country', options$ });
    options$.next([{ id: 'mx', label: 'Mexico' }]);
    fixture.detectChanges();
    const options = el.querySelectorAll('option');
    expect(options.length).toBe(1);
    expect(options[0].textContent?.trim()).toBe('Mexico');
  });

  it('shows errors after submit', () => {
    const { el, fixture, setup } = create({ name: 'country', options: OPTIONS, validators: [Validators.required], errorMessageMap: { required: 'Pick one.' } });
    setup.submitted$.next(true);
    fixture.detectChanges();
    expect(el.querySelector('p')!.textContent?.trim()).toBe('Pick one.');
    expect(el.querySelector('select')!.className).toContain('border-red-500');
  });

  it('creates a select item', () => {
    expect(NgsFormsTailwindFormItemSelectInputComponent.create({ name: 'country', label: 'L' }).type).toBe('select');
  });
});
