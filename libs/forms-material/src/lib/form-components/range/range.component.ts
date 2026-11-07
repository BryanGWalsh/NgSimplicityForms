import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemRangeComponent`. */
export interface NgsFormsFormItemConfigMaterialRange extends NgsFormsFormItemConfigBaseInput {
  /** @defaultValue 0 */
  min?: number;
  /** @defaultValue 100 */
  max?: number;
  /** @defaultValue 1 */
  step?: number;
  /**
   * Show the current value next to the label.
   * @defaultValue true
   */
  showValue?: boolean;
  /** Text after the shown value, for example `'%'` or `' km'`. */
  valueSuffix?: string;
  /**
   * Show a value label on the thumb while it is dragged (`discrete`).
   * @defaultValue false
   */
  discrete?: boolean;
  /** Show tick marks at each step. */
  showTickMarks?: boolean;
}

/**
 * Angular Material slider (`mat-slider`). Its value is a number. A control without a value starts at `min`.
 *
 * @remarks Registry key: `range`.
 */
@Component({
  selector: 'ngs-forms-mat-range',
  imports: [ReactiveFormsModule, MatSliderModule],
  templateUrl: './range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemRangeComponent
  extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialRange>
  implements OnInit
{
  static override key = 'range';
  rangeConfig = this.config as NgsFormsFormItemConfigMaterialRange;
  readonly min = this.rangeConfig.min ?? 0;
  readonly max = this.rangeConfig.max ?? 100;
  readonly step = this.rangeConfig.step ?? 1;
  /** Formats the thumb label. */
  readonly displayWith = (value: number) => `${value}${this.rangeConfig.valueSuffix ?? ''}`;

  override ngOnInit() {
    super.ngOnInit();
    // A slider cannot show "no value", so start where the thumb is drawn.
    if (this.control && (this.control.value === null || this.control.value === undefined || this.control.value === '')) {
      this.control.setValue(this.min);
    }
  }

  /** Creates a `range` item. */
  static create(config: NgsFormsFormItemConfigMaterialRange): NgsFormsFormItem<NgsFormsFormItemConfigMaterialRange> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemRangeComponent.key,
      config,
    };
  }
}
