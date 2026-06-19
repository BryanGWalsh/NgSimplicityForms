import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  NGS_FORMS_CONTROL_ADD_REMOVE_FN,
  NGS_FORMS_ITEM_DATA,
  NgsFormsInternalService,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { of } from 'rxjs';
import { NgsFormsMaterialRadioInputComponent } from './radio.component';

describe('NgsFormsMaterialRadioInputComponent', () => {
  let component: NgsFormsMaterialRadioInputComponent;
  let fixture: ComponentFixture<NgsFormsMaterialRadioInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatRadioModule,
        NoopAnimationsModule,
        NgsFormsMaterialRadioInputComponent,
      ],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'contactMethod',
              label: 'Preferred Contact Method',
              alignment: 'horizontal',
              options: [
                { id: 'email', label: 'Email Address' },
                { id: 'phone', label: 'Phone Number' },
              ],
            },
          },
        },
        {
          provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN,
          useValue: {
            add: jest.fn(),
            remove: jest.fn(),
          },
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

    fixture = TestBed.createComponent(NgsFormsMaterialRadioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a Material radio group with configured options', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const group = compiled.querySelector('mat-radio-group');
    const buttons = compiled.querySelectorAll('mat-radio-button');

    expect(compiled.querySelector('.ngs-material-radio-label')?.textContent?.trim()).toBe('Preferred Contact Method');
    expect(group).toBeTruthy();
    expect(group?.classList.contains('ngs-material-radio-group-horizontal')).toBe(true);
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('Email Address');
    expect(buttons[1].textContent?.trim()).toBe('Phone Number');
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicRadio',
      label: 'Radio Options',
    };

    const item = NgsFormsMaterialRadioInputComponent.create(config);

    expect(item.type).toBe('radio');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
