import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  NGS_FORMS_CONTROL_ADD_REMOVE_FN,
  NGS_FORMS_ITEM_DATA,
  NgsFormsInternalService,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { of } from 'rxjs';
import { NgsFormsMaterialFormItemCheckboxComponent } from './checkbox.component';

describe('NgsFormsMaterialFormItemCheckboxComponent', () => {
  let component: NgsFormsMaterialFormItemCheckboxComponent;
  let fixture: ComponentFixture<NgsFormsMaterialFormItemCheckboxComponent>;
  let mockAddRemoveFn: { add: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    mockAddRemoveFn = {
      add: jest.fn(),
      remove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCheckboxModule,
        NoopAnimationsModule,
        NgsFormsMaterialFormItemCheckboxComponent,
      ],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'agree',
              label: 'I agree to the terms',
            },
          },
        },
        {
          provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN,
          useValue: mockAddRemoveFn,
        },
        {
          provide: NgsFormsInternalService,
          useValue: {
            isSubmitted$: of(false),
            subscribeToState: jest.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: NgsFormsService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NgsFormsMaterialFormItemCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a Material checkbox with the configured label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('mat-checkbox');

    expect(checkbox).toBeTruthy();
    expect(checkbox?.textContent?.trim()).toBe('I agree to the terms');
  });

  it('should call formAddRemoveFns.add on init and remove on destroy', () => {
    expect(mockAddRemoveFn.add).toHaveBeenCalled();

    fixture.destroy();
    expect(mockAddRemoveFn.remove).toHaveBeenCalled();
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicCheckbox',
      label: 'Agree to cookies',
    };

    const item = NgsFormsMaterialFormItemCheckboxComponent.create(config);

    expect(item.type).toBe('checkbox');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
