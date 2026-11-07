import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgsFormComponent } from '../../core/form/form.component';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../../forms-core.module';
import { NgsFormsFormArrayContainerComponent } from './container';
import { NgsFormsFormArrayListComponent } from './list';
import { NgsFormsFormArrayAddItemComponent } from './add-item';
import { NgsFormsFormArrayRemoveItemComponent } from './remove-item';

@Component({
  selector: 'review-a11y-host',
  imports: [NgsFormComponent],
  providers: [NgsFormsService],
  template: '<ngs-form></ngs-form>',
})
class HostComponent {
  svc = inject(NgsFormsService);
  constructor() {
    NgsFormsCoreModule.registerCoreNgsFormComponents(inject(NgsFormsComponentRegistryService));
  }
}

describe('form array a11y regressions', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.componentInstance.svc.setFormConfig({
      inputUpdateDebounce: 0,
      globalState: {},
      root: NgsFormsFormArrayContainerComponent.create({
        name: 'people',
        initialItemCount: 3,
        items: [
          NgsFormsFormArrayListComponent.create({ templateItem: NgsFormsFormArrayRemoveItemComponent.create({ buttonText: 'Remove' }) }),
          NgsFormsFormArrayAddItemComponent.create({ buttonText: 'Add' }),
        ],
      }),
    } as any);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('keeps keyboard focus inside the form after a row is removed with its Remove button', async () => {
    const { fixture, el } = await setup();
    const removeButtons = () => Array.from(el.querySelectorAll<HTMLButtonElement>('ngs-forms-form-array-remove-item button'));
    expect(removeButtons().length).toBe(3);
    const btn = removeButtons()[1];
    btn.focus();
    expect(document.activeElement).toBe(btn);
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(removeButtons().length).toBe(2);
    // focus should move to a neighbouring row (or the add button), not fall back to <body>
    expect(document.activeElement).not.toBe(document.body);
    expect(el.contains(document.activeElement)).toBe(true);
  });

  it('Remove buttons have distinct accessible names per row', async () => {
    const { el } = await setup();
    const names = Array.from(el.querySelectorAll<HTMLButtonElement>('ngs-forms-form-array-remove-item button')).map(
      (b) => b.getAttribute('aria-label') ?? b.textContent!.trim()
    );
    expect(new Set(names).size).toBe(names.length);
  });
});
