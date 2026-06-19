import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsBootstrapFormsItemCheckboxComponent } from './checkbox.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NgsFormsBootstrapFormsItemCheckboxComponent', () => {
  let component: NgsFormsBootstrapFormsItemCheckboxComponent;
  let fixture: ComponentFixture<NgsFormsBootstrapFormsItemCheckboxComponent>;
  let mockInternalService: any;
  let mockFormsService: any;
  let mockAddRemoveFn: any;

  beforeEach(async () => {
    mockInternalService = {
      isSubmitted$: of(false),
      subscribeToState: jest.fn().mockReturnValue(of({}))
    };

    mockFormsService = {};

    mockAddRemoveFn = {
      add: jest.fn(),
      remove: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgsFormsBootstrapFormsItemCheckboxComponent],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'agree',
              label: 'I agree to the terms',
            }
          }
        },
        {
          provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN,
          useValue: mockAddRemoveFn
        },
        {
          provide: NgsFormsInternalService,
          useValue: mockInternalService
        },
        {
          provide: NgsFormsService,
          useValue: mockFormsService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NgsFormsBootstrapFormsItemCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and checkbox with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const input = compiled.querySelector('input');

    expect(label?.textContent?.trim()).toBe('I agree to the terms');
    expect(input?.getAttribute('type')).toBe('checkbox');
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
    const item = NgsFormsBootstrapFormsItemCheckboxComponent.create(config);
    expect(item.type).toBe('checkbox');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
