import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  NGS_FORMS_CONTROL_ADD_REMOVE_FN,
  NGS_FORMS_ITEM_DATA,
  NgsFormsInternalService,
  NgsFormsService,
} from '@ng-simplicity/forms-core';
import { of } from 'rxjs';
import { NgsFormsMaterialFormItemSelectInputComponent } from './select.component';

describe('NgsFormsMaterialFormItemSelectInputComponent', () => {
  let component: NgsFormsMaterialFormItemSelectInputComponent;
  let fixture: ComponentFixture<NgsFormsMaterialFormItemSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        NgsFormsMaterialFormItemSelectInputComponent,
      ],
      providers: [
        {
          provide: NGS_FORMS_ITEM_DATA,
          useValue: {
            config: {
              name: 'frequency',
              label: 'Delivery Frequency',
              placeholder: 'Select frequency',
              options: [
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
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

    fixture = TestBed.createComponent(NgsFormsMaterialFormItemSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a Material select with label, placeholder, and options', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('mat-label');
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const select = await loader.getHarness(MatSelectHarness);

    expect(label?.textContent).toBe('Delivery Frequency');
    expect(await select.getValueText()).toBe('');

    await select.open();
    const options = await select.getOptions();

    expect(options.length).toBe(3);
    expect(await options[0].getText()).toBe('Select frequency');
    expect(await options[0].isDisabled()).toBe(true);
    expect(await options[1].getText()).toBe('Daily');
    expect(await options[2].getText()).toBe('Weekly');
  });

  it('should static create a form item correctly', () => {
    const config = {
      name: 'dynamicSelect',
      label: 'Dropdown',
    };

    const item = NgsFormsMaterialFormItemSelectInputComponent.create(config);

    expect(item.type).toBe('select');
    expect(item.config).toEqual(config);
    expect(item.uuid).toBeDefined();
  });
});
