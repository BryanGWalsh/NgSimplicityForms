import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigTailwindTextArea } from './text-area.config';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { v4 } from 'uuid';

/**
 * Tailwind CSS multi line text area with a label and inline validation message.
 *
 * @remarks Registry key: `input-textarea`. The height comes from the `textarea` class (`h-52` by default).
 */
@Component({
  selector: 'ngs-forms-tw-text-area',
  imports: [ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemTextAreaComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigTailwindTextArea> {
  static override key = 'input-textarea';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  textAreaConfig = this.config as NgsFormsFormItemConfigTailwindTextArea;
  /** Whether the label sits to the left of the textarea. */
  readonly horizontal = this.textAreaConfig.labelLocation === 'left';
  /** The `id` of the `<textarea>`. */
  readonly inputId = this.id;
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates an `input-textarea` item. */
  static create(config: NgsFormsFormItemConfigTailwindTextArea): NgsFormsFormItem<NgsFormsFormItemConfigTailwindTextArea> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemTextAreaComponent.key,
      config,
    };
  }
}
