import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { NgsFormsFormItemConfigTailwindRange } from './range.config';

/**
 * Tailwind CSS range slider. Its value is a number. A control without a value starts at `min`.
 *
 * @remarks Registry key: `range`.
 */
@Component({
  selector: 'ngs-forms-tw-range',
  imports: [ReactiveFormsModule],
  templateUrl: './range.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemRangeComponent
  extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigTailwindRange>
  implements OnInit
{
  static override key = 'range';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  /** @internal */
  readonly cx = ngsTwClassList;
  rangeConfig = this.config as NgsFormsFormItemConfigTailwindRange;
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
  static create(config: NgsFormsFormItemConfigTailwindRange): NgsFormsFormItem<NgsFormsFormItemConfigTailwindRange> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemRangeComponent.key,
      config,
    };
  }
}
