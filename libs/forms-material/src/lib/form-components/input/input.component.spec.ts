import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsFormItemConfigMaterialTextInput, NgsFormsMaterialFormItemInputComponent } from './input.component';
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
    const config: NgsFormsFormItemConfigMaterialTextInput = {
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

describe('NgsFormsMaterialFormItemInputComponent with id, value and disabled', () => {
  function create(config: object) {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, NoopAnimationsModule, NgsFormsMaterialFormItemInputComponent],
      providers: [
        { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
        { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: { add: jest.fn(), remove: jest.fn() } },
        { provide: NgsFormsInternalService, useValue: { isSubmitted$: of(false), subscribeToState: jest.fn().mockReturnValue(of({})) } },
        { provide: NgsFormsService, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(NgsFormsMaterialFormItemInputComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('passes a configured id to matInput', () => {
    const el = create({ name: 'email', label: 'Email', id: 'email-field' });
    expect(el.querySelector('input')!.id).toBe('email-field');
  });

  it('lets Material generate the id when none is configured', () => {
    const el = create({ name: 'email', label: 'Email' });
    expect(el.querySelector('input')!.id).toMatch(/^mat-input-/);
  });

  it('starts with the configured value and can be disabled', () => {
    const el = create({ name: 'email', label: 'Email', value: 'ada@example.com', disabled: true });
    const input = el.querySelector('input')!;
    expect(input.value).toBe('ada@example.com');
    expect(input.disabled).toBe(true);
  });
});
