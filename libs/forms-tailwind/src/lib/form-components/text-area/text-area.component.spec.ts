import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NgsFormsTailwindFormItemTextAreaComponent } from './text-area.component';
import { tailwindTestProviders } from '../../testing/test-providers';

describe('NgsFormsTailwindFormItemTextAreaComponent', () => {
  function create(config: object) {
    const setup = tailwindTestProviders(config);
    TestBed.configureTestingModule({ imports: [NgsFormsTailwindFormItemTextAreaComponent], providers: setup.providers });
    const fixture = TestBed.createComponent(NgsFormsTailwindFormItemTextAreaComponent);
    fixture.detectChanges();
    return { fixture, setup, el: fixture.nativeElement as HTMLElement };
  }

  it('renders a labelled textarea with extra classes', () => {
    const { el } = create({ name: 'notes', label: 'Notes', placeholder: 'Write…', inputCssClass: 'font-mono' });
    const textarea = el.querySelector('textarea')!;
    expect(el.querySelector('label')!.getAttribute('for')).toBe(textarea.id);
    expect(textarea.getAttribute('placeholder')).toBe('Write…');
    expect(textarea.className).toContain('h-52');
    expect(textarea.className).toContain('font-mono');
  });

  it('supports the horizontal layout', () => {
    const { el, fixture } = create({ name: 'notes', label: 'Notes', labelLocation: 'left' });
    expect(el.querySelector('textarea')!.id).toBe(fixture.componentInstance.id);
  });

  it('shows errors after submit', () => {
    const { el, fixture, setup } = create({ name: 'notes', validators: [Validators.required], errorMessageMap: { required: 'Add a note.' } });
    setup.submitted$.next(true);
    fixture.detectChanges();
    expect(el.querySelector('p')!.textContent?.trim()).toBe('Add a note.');
  });

  it('creates an input-textarea item', () => {
    expect(NgsFormsTailwindFormItemTextAreaComponent.create({ name: 'notes', label: 'L' }).type).toBe('input-textarea');
  });
});
