import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormComponent } from '../../core/form/form.component';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../../forms-core.module';
import { NgsFormsBaseClassFormInputComponent } from '../../../classes/form-component-base/form-component-input.class';
import { NgsFormsFormGroupComponent } from '../form-group';
import { NgsFormsFormArrayContainerComponent } from './container';
import { NgsFormsFormArrayListComponent } from './list';
import { NgsFormsFormArrayRemoveItemComponent } from './remove-item';
import { NgsFormsFormArrayAddItemComponent } from './add-item';
import { NgsFormsColumnComponent } from '../column';

@Component({
  selector: 'rv-input',
  imports: [ReactiveFormsModule],
  template: `@if (control) {<input class="rv" [formControl]="control" />}`,
})
class RvInputComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'rv-input';
}

async function settle(fixture: any) {
  for (let i = 0; i < 6; i++) {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
  }
}

describe('form array values', () => {
  let service: NgsFormsService;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const reg = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(reg);
    reg.register(RvInputComponent.key, RvInputComponent);
    fixture = TestBed.createComponent(NgsFormComponent);
    service = TestBed.inject(NgsFormsService);
    fixture.detectChanges();
    service.setFormConfig({
      root: NgsFormsFormGroupComponent.create({
        name: 'root',
        items: [
          NgsFormsFormArrayContainerComponent.create({
            name: 'people',
            initialItemCount: 3,
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: NgsFormsColumnComponent.create({
                  items: [
                    { uuid: 'n', type: 'rv-input', config: { name: 'n', label: 'N' } },
                    NgsFormsFormArrayRemoveItemComponent.create({}),
                  ],
                }),
              }),
              NgsFormsFormArrayAddItemComponent.create({}),
            ],
          }),
        ],
      }),
    } as any);
    await settle(fixture);
    service.patchValue({ root: { people: [{ n: 'a' }, { n: 'b' }, { n: 'c' }] } });
    await settle(fixture);
  });

  function removeButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('ngs-forms-form-array-remove-item button'));
  }

  it('sanity: rows patched', () => {
    expect(service.formValue).toEqual({ root: { people: [{ n: 'a' }, { n: 'b' }, { n: 'c' }] } });
  });

  it('removing row 0 then clicking remove on the (new) first row removes that row, not a shifted one', async () => {
    removeButtons()[0].click();
    await settle(fixture);
    expect(service.formValue.root.people).toEqual([{ n: 'b' }, { n: 'c' }]);
    // The row now displayed first is 'b'. Clicking its remove button must remove 'b'.
    removeButtons()[0].click();
    await settle(fixture);
    expect(service.formValue.root.people).toEqual([{ n: 'c' }]);
  });

  it('after removing row 0, removing the last displayed row works', async () => {
    removeButtons()[0].click();
    await settle(fixture);
    const btns = removeButtons();
    btns[btns.length - 1].click(); // row 'c', now at index 1, but injected index is 2
    await settle(fixture);
    expect(service.formValue.root.people).toEqual([{ n: 'b' }]);
  });
});
