import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsBootstrapFormItemInputComponent } from './input.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NgsFormsBootstrapFormItemInputComponent', () => {
  let component: NgsFormsBootstrapFormItemInputComponent;
  let fixture: ComponentFixture<NgsFormsBootstrapFormItemInputComponent>;
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
      imports: [ReactiveFormsModule, NgsFormsBootstrapFormItemInputComponent],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'testInput',
              label: 'Test Label',
              placeholder: 'Enter text...',
              type: 'text',
              labelLocation: 'top'
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

    fixture = TestBed.createComponent(NgsFormsBootstrapFormItemInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and input field with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const input = compiled.querySelector('input');

    expect(label?.textContent).toBe('Test Label');
    expect(input?.getAttribute('placeholder')).toBe('Enter text...');
    expect(input?.getAttribute('type')).toBe('text');
  });

  it('should call formAddRemoveFns.add on init and remove on destroy', () => {
    expect(mockAddRemoveFn.add).toHaveBeenCalled();

    fixture.destroy();
    expect(mockAddRemoveFn.remove).toHaveBeenCalled();
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicInput',
      label: 'Dynamic',
      placeholder: '',
      type: 'text' as const,
      labelLocation: 'top' as const
    };
    const item = NgsFormsBootstrapFormItemInputComponent.create(config);
    expect(item.type).toBe('input-text');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
