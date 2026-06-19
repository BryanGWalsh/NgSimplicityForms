import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsBootstrapFormItemSelectInputComponent } from './select.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NgsFormsBootstrapFormItemSelectInputComponent', () => {
  let component: NgsFormsBootstrapFormItemSelectInputComponent;
  let fixture: ComponentFixture<NgsFormsBootstrapFormItemSelectInputComponent>;
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
      imports: [ReactiveFormsModule, NgsFormsBootstrapFormItemSelectInputComponent],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'country',
              label: 'Country',
              placeholder: 'Select country',
              labelLocation: 'top',
              options: [
                { id: 'us', label: 'United States' },
                { id: 'ca', label: 'Canada' }
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

    fixture = TestBed.createComponent(NgsFormsBootstrapFormItemSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and select element with correct options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Country');

    const select = compiled.querySelector('select');
    expect(select).toBeTruthy();

    const options = compiled.querySelectorAll('option');
    // Placeholder + 2 options = 3 options
    expect(options.length).toBe(3);
    expect(options[0].textContent?.trim()).toBe('Select country');
    expect(options[1].getAttribute('value')).toBe('us');
    expect(options[2].getAttribute('value')).toBe('ca');
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicSelect',
      label: 'Dropdown',
    };
    const item = NgsFormsBootstrapFormItemSelectInputComponent.create(config);
    expect(item.type).toBe('select');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
