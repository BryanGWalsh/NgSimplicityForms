import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigTailwindRadio } from './radio.config';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { v4 } from 'uuid';

/**
 * Tailwind CSS radio group. The control's value is the `id` of the chosen option.
 *
 * @remarks Registry key: `radio`. Set `alignment: 'horizontal'` to show the options inline.
 */
@Component({
  selector: 'ngs-forms-tw-radio-group',
  imports: [ReactiveFormsModule],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindRadioInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigTailwindRadio> {
  static override key = 'radio';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  radioConfig = this.config as NgsFormsFormItemConfigTailwindRadio;
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates a `radio` item. */
  static create(config: NgsFormsFormItemConfigTailwindRadio): NgsFormsFormItem<NgsFormsFormItemConfigTailwindRadio> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindRadioInputComponent.key,
      config,
    };
  }
}
