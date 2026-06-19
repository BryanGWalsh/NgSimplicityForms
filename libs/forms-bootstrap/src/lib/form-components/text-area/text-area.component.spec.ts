import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgsFormsBootstrapFormsItemTextAreaComponent } from './text-area.component';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NgsFormsBootstrapFormsItemTextAreaComponent', () => {
  let component: NgsFormsBootstrapFormsItemTextAreaComponent;
  let fixture: ComponentFixture<NgsFormsBootstrapFormsItemTextAreaComponent>;
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
      imports: [ReactiveFormsModule, NgsFormsBootstrapFormsItemTextAreaComponent],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'testTextArea',
              label: 'Bio',
              placeholder: 'Enter your bio...',
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

    fixture = TestBed.createComponent(NgsFormsBootstrapFormsItemTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and textarea field with correct config', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const textarea = compiled.querySelector('textarea');

    expect(label?.textContent).toBe('Bio');
    expect(textarea?.getAttribute('placeholder')).toBe('Enter your bio...');
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
      labelLocation: 'top' as const
    };
    const item = NgsFormsBootstrapFormsItemTextAreaComponent.create(config);
    expect(item.type).toBe('input-textarea');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
