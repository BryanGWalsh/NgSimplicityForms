import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgsFormComponent } from '../../components/core/form/form.component';
import { NgsFormsService } from './forms.service';
import { NgsFormsComponentRegistryService } from '../form-component-registry/form-component-registry.service';
import { NgsFormsCoreModule } from '../../forms-core.module';
import { NgsFormsBaseClassFormInputComponent } from '../../classes/form-component-base/form-component-input.class';
import { NgsFormsFormGroupComponent } from '../../components/shared-form-components/form-group';
import { NgsFormsFormArrayContainerComponent } from '../../components/shared-form-components/form-array/container';
import { NgsFormsFormArrayListComponent } from '../../components/shared-form-components/form-array/list';
import { NgsFormsFormArrayAddItemComponent } from '../../components/shared-form-components/form-array/add-item';
import { NgsFormsFormArrayRemoveItemComponent } from '../../components/shared-form-components/form-array/remove-item';
import { NgsFormsColumnComponent } from '../../components/shared-form-components/column';
import { constructServerErrorMessageObject } from '../../misc/server-errors';

@Component({
  selector: 'se-input',
  imports: [ReactiveFormsModule],
  template: `@if (control) {<input [attr.data-name]="config.name" [formControl]="control" /><span class="err" [attr.data-for]="config.name">{{ errorMessage }}</span>}`,
})
class SeInputComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'se-input';
}

async function settle(fixture: any) {
  for (let i = 0; i < 6; i++) {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
  }
}

describe('NgsFormsService server errors', () => {
  let service: NgsFormsService;
  let fixture: any;
  const nameValidators$ = new BehaviorSubject([Validators.maxLength(20)]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NgsFormComponent], providers: [NgsFormsService] }).compileComponents();
    const reg = TestBed.inject(NgsFormsComponentRegistryService);
    NgsFormsCoreModule.registerCoreNgsFormComponents(reg);
    reg.register(SeInputComponent.key, SeInputComponent);
    fixture = TestBed.createComponent(NgsFormComponent);
    service = TestBed.inject(NgsFormsService);
    fixture.detectChanges();
    service.setFormConfig({
      root: NgsFormsFormGroupComponent.create({
        name: 'registration',
        items: [
          {
            uuid: 'u',
            type: 'se-input',
            config: {
              name: 'userName',
              label: 'User name',
              validators: [Validators.required],
              errorMessageMap: { required: 'Required', taken: 'User Name Not Available' },
            },
          },
          {
            uuid: 'd',
            type: 'se-input',
            config: { name: 'displayName', label: 'Display', validators$: nameValidators$ },
          },
          NgsFormsFormArrayContainerComponent.create({
            name: 'contacts',
            initialItemCount: 4,
            items: [
              NgsFormsFormArrayListComponent.create({
                templateItem: NgsFormsColumnComponent.create({
                  items: [
                    {
                      uuid: 'c',
                      type: 'se-input',
                      config: { name: 'contactName', label: 'Contact', errorMessageMap: { taken: 'Contact taken' } },
                    },
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
    service.patchValue({
      registration: {
        userName: 'bryan',
        displayName: 'Bryan',
        contacts: [{ contactName: 'a' }, { contactName: 'b' }, { contactName: 'c' }, { contactName: 'd' }],
      },
    });
    await settle(fixture);
  });

  function messages(name: string): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll(`.err[data-for="${name}"]`)).map((e: any) => e.textContent.trim());
  }

  function input(name: string, index = 0): HTMLInputElement {
    return fixture.nativeElement.querySelectorAll(`input[data-name="${name}"]`)[index];
  }

  function type(el: HTMLInputElement, value: string) {
    el.value = value;
    el.dispatchEvent(new Event('input'));
  }

  it('shows the mapped message for a server error key and makes the form invalid', async () => {
    expect(service.isValid).toBe(true);
    expect(service.setServerErrorMessages({ registration: { userName: 'taken' } })).toEqual([]);
    await settle(fixture);
    expect(messages('userName')).toEqual(['User Name Not Available']);
    expect(service.isValid).toBe(false);
  });

  it('shows the key itself when it has no entry in errorMessageMap', async () => {
    service.setServerErrorMessages({ registration: { displayName: 'That name is reserved' } });
    await settle(fixture);
    expect(messages('displayName')).toEqual(['That name is reserved']);
  });

  it('targets one form array row by index', async () => {
    service.setServerErrorMessages({ registration: { contacts: [{}, {}, { contactName: 'taken' }, {}] } });
    await settle(fixture);
    expect(messages('contactName')).toEqual(['', '', 'Contact taken', '']);
  });

  it('accepts the object from constructServerErrorMessageObject', async () => {
    service.setServerErrorMessages(
      constructServerErrorMessageObject([
        { jsonPath: 'registration.userName', validator: 'taken' },
        { jsonPath: 'registration.contacts[1].contactName', validator: 'taken' },
      ])
    );
    await settle(fixture);
    expect(messages('userName')).toEqual(['User Name Not Available']);
    expect(messages('contactName')).toEqual(['', 'Contact taken', '', '']);
  });

  it('clears a server error when that field changes, and leaves the others', async () => {
    service.setServerErrorMessages({ registration: { userName: 'taken', contacts: [{}, {}, { contactName: 'taken' }] } });
    await settle(fixture);
    type(input('userName'), 'bryan2');
    await settle(fixture);
    expect(messages('userName')).toEqual(['']);
    expect(messages('contactName')[2]).toBe('Contact taken');
    type(input('contactName', 2), 'c2');
    await settle(fixture);
    expect(messages('contactName')[2]).toBe('');
    expect(service.isValid).toBe(true);
  });

  it('does not come back when the field is changed back to the rejected value', async () => {
    service.setServerErrorMessages({ registration: { userName: 'taken' } });
    await settle(fixture);
    type(input('userName'), 'x');
    type(input('userName'), 'bryan');
    await settle(fixture);
    expect(messages('userName')).toEqual(['']);
  });

  it('survives re-validation, including new validators from validators$', async () => {
    service.setServerErrorMessages({ registration: { displayName: 'reserved' } });
    await settle(fixture);
    nameValidators$.next([Validators.maxLength(30)]);
    service.patchValue({ registration: { userName: 'bryan' } });
    await settle(fixture);
    expect(messages('displayName')).toEqual(['reserved']);
  });

  it('returns paths that match no control', () => {
    expect(
      service.setServerErrorMessages({
        registration: { nope: 'x', contacts: [{}, {}, {}, {}, { contactName: 'taken' }], userName: { deep: 'x' } },
      } as any)
    ).toEqual(['registration.nope', 'registration.contacts[4]', 'registration.userName']);
  });

  it('replaces earlier server errors on the next call', async () => {
    service.setServerErrorMessages({ registration: { userName: 'taken' } });
    service.setServerErrorMessages({ registration: { displayName: 'reserved' } });
    await settle(fixture);
    expect(messages('userName')).toEqual(['']);
    expect(messages('displayName')).toEqual(['reserved']);
  });

  it('clearServerErrorMessages removes them all', async () => {
    service.setServerErrorMessages({ registration: { userName: 'taken', displayName: 'reserved' } });
    service.clearServerErrorMessages();
    await settle(fixture);
    expect(messages('userName')).toEqual(['']);
    expect(messages('displayName')).toEqual(['']);
    expect(service.isValid).toBe(true);
  });

  it('clears all server errors when a form array row is removed, since rows shift', async () => {
    service.setServerErrorMessages({ registration: { userName: 'taken', contacts: [{}, {}, { contactName: 'taken' }] } });
    await settle(fixture);
    (fixture.nativeElement.querySelector('ngs-forms-form-array-remove-item button') as HTMLButtonElement).click();
    await settle(fixture);
    expect(messages('contactName')).toEqual(['', '', '']);
    expect(messages('userName')).toEqual(['']);
    expect(service.isValid).toBe(true);
  });
});
