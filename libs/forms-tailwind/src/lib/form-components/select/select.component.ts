import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigTailwindSelectInput } from './select.config';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { v4 } from 'uuid';

/**
 * Tailwind CSS native select. The control's value is the `id` of the chosen option.
 *
 * @remarks Registry key: `select`. Supports `options$` for options that change at runtime, a disabled
 * `placeholder` option, and `labelLocation` (`top`, the default, or `left`).
 */
@Component({
  selector: 'ngs-forms-tw-select',
  imports: [ReactiveFormsModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemSelectInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigTailwindSelectInput> {
  static override key = 'select';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  selectConfig = this.config as NgsFormsFormItemConfigTailwindSelectInput;
  /** Whether the label sits to the left of the select. */
  readonly horizontal = this.selectConfig.labelLocation === 'left';
  /** The `id` of the `<select>`. */
  readonly inputId = this.id;
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates a `select` item. */
  static create(config: NgsFormsFormItemConfigTailwindSelectInput): NgsFormsFormItem<NgsFormsFormItemConfigTailwindSelectInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemSelectInputComponent.key,
      config,
    };
  }
}
