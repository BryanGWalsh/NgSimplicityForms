import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsMaterialFormItemInputComponent } from './input.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('NgsFormsMaterialFormItemInputComponent', () => {
  let component: NgsFormsMaterialFormItemInputComponent;
  let fixture: ComponentFixture<NgsFormsMaterialFormItemInputComponent>;
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
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        NgsFormsMaterialFormItemInputComponent
      ],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'testInput',
              label: 'Test Label',
              placeholder: 'Enter text...',
              type: 'text'
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

    fixture = TestBed.createComponent(NgsFormsMaterialFormItemInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render material label and input field with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('mat-label');
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
      type: 'text'
    };
    const item = NgsFormsMaterialFormItemInputComponent.create(config);
    expect(item.type).toBe('input-text');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
