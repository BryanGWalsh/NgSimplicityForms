import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsMaterialFormItemTextAreaComponent } from './text-area.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('NgsFormsMaterialFormItemTextAreaComponent', () => {
  let component: NgsFormsMaterialFormItemTextAreaComponent;
  let fixture: ComponentFixture<NgsFormsMaterialFormItemTextAreaComponent>;
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
        NgsFormsMaterialFormItemTextAreaComponent
      ],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'testTextArea',
              label: 'Bio',
              placeholder: 'Enter bio...',
              rows: 5
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

    fixture = TestBed.createComponent(NgsFormsMaterialFormItemTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render material label and textarea field with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('mat-label');
    const textarea = compiled.querySelector('textarea');

    expect(label?.textContent).toBe('Bio');
    expect(textarea?.getAttribute('placeholder')).toBe('Enter bio...');
    expect(textarea?.getAttribute('rows')).toBe('5');
  });

  it('should call formAddRemoveFns.add on init and remove on destroy', () => {
    expect(mockAddRemoveFn.add).toHaveBeenCalled();

    fixture.destroy();
    expect(mockAddRemoveFn.remove).toHaveBeenCalled();
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicTextArea',
      label: 'Comments',
      placeholder: '',
      rows: 4
    };
    const item = NgsFormsMaterialFormItemTextAreaComponent.create(config);
    expect(item.type).toBe('input-textarea');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
