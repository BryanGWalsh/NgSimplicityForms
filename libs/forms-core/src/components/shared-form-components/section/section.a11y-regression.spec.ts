import { TestBed } from '@angular/core/testing';
import { NgsFormsFormSectionComponent } from './section.component';
import { NGS_FORMS_ITEM_DATA } from '../../../misc';

describe('section a11y regressions', () => {
  it('renders the section title as a real heading (it is styled as .h3)', () => {
    TestBed.configureTestingModule({
      imports: [NgsFormsFormSectionComponent],
      providers: [{ provide: NGS_FORMS_ITEM_DATA, useValue: NgsFormsFormSectionComponent.create({ title: 'Contact details', items: [] }) }],
    });
    const fixture = TestBed.createComponent(NgsFormsFormSectionComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const title = el.querySelector('.form-section-title')!;
    expect(title.className).toContain('h3');
    const isHeading = /^H[1-6]$/.test(title.tagName) || title.getAttribute('role') === 'heading';
    expect(isHeading).toBe(true);
    // and the section should be exposed as a group/region named by the title
    const section = el.querySelector('.form-section')!;
    expect(['group', 'region'].includes(section.getAttribute('role') ?? '') || section.tagName === 'FIELDSET' || section.tagName === 'SECTION').toBe(true);
  });
});
