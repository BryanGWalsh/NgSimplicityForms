import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NgsFormsTailwindFormItemInputComponent } from './input.component';
import { hasClasses, tailwindTestProviders } from '../../testing/test-providers';
import { NGS_FORMS_TAILWIND_DEFAULT_CLASSES, provideNgsFormsTailwindClasses } from '../../forms-tailwind.classes';

describe('NgsFormsTailwindFormItemInputComponent', () => {
  let fixture: ComponentFixture<NgsFormsTailwindFormItemInputComponent>;
  let setup: ReturnType<typeof tailwindTestProviders>;

  function create(config: object, extra: unknown[] = []) {
    setup = tailwindTestProviders(config);
    TestBed.configureTestingModule({
      imports: [NgsFormsTailwindFormItemInputComponent],
      providers: [...setup.providers, ...(extra as never[])],
    });
    fixture = TestBed.createComponent(NgsFormsTailwindFormItemInputComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a stacked label and input by default', () => {
    const el = create({ name: 'username', label: 'Username', placeholder: 'Pick one' });
    const label = el.querySelector('label')!;
    const input = el.querySelector('input')!;
    expect(label.textContent?.trim()).toBe('Username');
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.id).toBe(fixture.componentInstance.id);
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('placeholder')).toBe('Pick one');
    expect(input.className).toContain('rounded-md');
    expect(input.className).toContain('border-gray-300');
  });

  it('renders the horizontal layout for labelLocation left', () => {
    const el = create({ name: 'username', label: 'Username', labelLocation: 'left', type: 'password' });
    expect(el.querySelector('input')!.id).toBe(fixture.componentInstance.id);
    expect(el.querySelector('input')!.getAttribute('type')).toBe('password');
    expect(el.firstElementChild!.className).toContain('sm:grid-cols-12');
  });

  it('uses the configured id on the input and its label', () => {
    const el = create({ name: 'username', label: 'Username', id: 'username-field' });
    expect(el.querySelector('input')!.id).toBe('username-field');
    expect(el.querySelector('label')!.getAttribute('for')).toBe('username-field');
  });

  it('starts with the configured value', () => {
    const el = create({ name: 'username', label: 'Username', value: 'ada' });
    expect(el.querySelector('input')!.value).toBe('ada');
  });

  it('shows the mapped error message once submitted', () => {
    const el = create({ name: 'username', label: 'Username', validators: [Validators.required], errorMessageMap: { required: 'Required!' } });
    expect(el.querySelector('p')).toBeNull();
    setup.submitted$.next(true);
    fixture.detectChanges();
    const input = el.querySelector('input')!;
    const error = el.querySelector('p')!;
    expect(error.textContent?.trim()).toBe('Required!');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.className).toContain('border-red-500');
    expect(input.className).not.toContain('border-gray-300');
  });

  it('uses classes from provideNgsFormsTailwindClasses', () => {
    const el = create({ name: 'username', label: 'Username', inputCssClass: 'tracking-wide' }, [provideNgsFormsTailwindClasses({ controlValid: 'border-emerald-400' })]);
    const input = el.querySelector('input')!;
    expect(input.className).toContain('border-emerald-400');
    expect(input.className).toContain('tracking-wide');
    expect(hasClasses(el.querySelector('label')!, NGS_FORMS_TAILWIND_DEFAULT_CLASSES.labelValid)).toBe(true);
  });

  it('registers and removes its control', () => {
    create({ name: 'username' });
    expect(setup.addRemove.add).toHaveBeenCalled();
    fixture.destroy();
    expect(setup.addRemove.remove).toHaveBeenCalled();
  });

  it('creates an input-text item', () => {
    const config = { name: 'email', label: 'Email', type: 'email' as const };
    const item = NgsFormsTailwindFormItemInputComponent.create(config);
    expect(item.type).toBe('input-text');
    expect(item.config).toBe(config);
    expect(item.uuid).toBeDefined();
  });
});
