import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsBootstrapRadioInputComponent } from './radio.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NgsFormsBootstrapRadioInputComponent', () => {
  let component: NgsFormsBootstrapRadioInputComponent;
  let fixture: ComponentFixture<NgsFormsBootstrapRadioInputComponent>;
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
      imports: [ReactiveFormsModule, NgsFormsBootstrapRadioInputComponent],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'gender',
              label: 'Gender',
              alignment: 'horizontal',
              options: [
                { id: 'm', label: 'Male' },
                { id: 'f', label: 'Female' }
              ]
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

    fixture = TestBed.createComponent(NgsFormsBootstrapRadioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and radio buttons with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('.form-label');
    expect(label?.textContent?.trim()).toBe('Gender');

    const radioInputs = compiled.querySelectorAll('input[type="radio"]');
    expect(radioInputs.length).toBe(2);

    const labels = compiled.querySelectorAll('.form-check-label');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent?.trim()).toBe('Male');
    expect(labels[1].textContent?.trim()).toBe('Female');

    expect(radioInputs[0].getAttribute('id')).toContain('m');
    expect(radioInputs[1].getAttribute('id')).toContain('f');
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicRadio',
      label: 'Radio Options',
    };
    const item = NgsFormsBootstrapRadioInputComponent.create(config);
    expect(item.type).toBe('radio');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
