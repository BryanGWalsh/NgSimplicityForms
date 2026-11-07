import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemDatepickerComponent`. */
export interface NgsFormsFormItemConfigMaterialDatepicker extends NgsFormsFormItemConfigBaseInput {
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /** Earliest date that can be chosen. Earlier typed dates report the `matDatepickerMin` error. */
  min?: Date | null;
  /** Latest date that can be chosen. Later typed dates report the `matDatepickerMax` error. */
  max?: Date | null;
  /**
   * The calendar view the picker opens in.
   * @defaultValue 'month'
   */
  startView?: 'month' | 'year' | 'multi-year';
  /** Hint under the input, for example the expected format. */
  hint?: string;
}

/**
 * Angular Material datepicker (`mat-datepicker`) on a text input with a calendar toggle. The value is a `Date`
 * (or whatever your app's `DateAdapter` uses), or `null`.
 *
 * @remarks Registry key: `datepicker`. Uses your app's `DateAdapter` when one is provided, for example with
 * `provideNativeDateAdapter()` or a Luxon or date-fns adapter; otherwise it uses the native `Date` adapter. Text
 * that is not a date reports the `matDatepickerParse` error.
 */
@Component({
  selector: 'ngs-forms-mat-datepicker',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useFactory: () =>
        inject(DateAdapter, { optional: true, skipSelf: true }) ?? new NativeDateAdapter(inject(MAT_DATE_LOCALE, { optional: true })),
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: () => inject(MAT_DATE_FORMATS, { optional: true, skipSelf: true }) ?? MAT_NATIVE_DATE_FORMATS,
    },
  ],
})
export class NgsFormsMaterialFormItemDatepickerComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialDatepicker> {
  static override key = 'datepicker';
  dateConfig = this.config as NgsFormsFormItemConfigMaterialDatepicker;
  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: AbstractControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    },
  };

  /** Creates a `datepicker` item. */
  static create(config: NgsFormsFormItemConfigMaterialDatepicker): NgsFormsFormItem<NgsFormsFormItemConfigMaterialDatepicker> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemDatepickerComponent.key,
      config,
    };
  }
}
