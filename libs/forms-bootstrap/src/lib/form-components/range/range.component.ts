import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NgsFormsFormItemConfigBootstrapRange } from './range.config';

/**
 * Bootstrap 5 range slider (`.form-range`). Its value is a number. A control without a value starts at `min`.
 *
 * @remarks Registry key: `range`.
 */
@Component({
  selector: 'ngs-forms-bs-range',
  imports: [ReactiveFormsModule],
  templateUrl: './range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemRangeComponent
  extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapRange>
  implements OnInit
{
  static override key = 'range';
  rangeConfig = this.config as NgsFormsFormItemConfigBootstrapRange;
  readonly min = this.rangeConfig.min ?? 0;
  readonly max = this.rangeConfig.max ?? 100;
  readonly step = this.rangeConfig.step ?? 1;

  override ngOnInit() {
    super.ngOnInit();
    // A range input cannot show "no value", so start where the thumb is drawn.
    if (this.control && (this.control.value === null || this.control.value === undefined || this.control.value === '')) {
      this.control.setValue(this.min);
    }
  }

  /** Creates a `range` item. */
  static create(config: NgsFormsFormItemConfigBootstrapRange): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapRange> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemRangeComponent.key,
      config,
    };
  }
}
