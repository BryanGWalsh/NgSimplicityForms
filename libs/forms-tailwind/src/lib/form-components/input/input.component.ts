import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, ngsDefaults } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigTailwindTextInput } from './input.config';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { v4 } from 'uuid';

/**
 * Tailwind CSS text input with a label and inline validation message.
 *
 * @remarks Registry key: `input-text`. Supports `type` (`text`, `email`, `password`) and `labelLocation`
 * (`top`, the default, or `left` for a horizontal 2 / 10 column grid from the `sm` breakpoint up).
 * @example
 * ```ts
 * NgsFormsTailwindFormItemInputComponent.create({
 *   name: 'email',
 *   label: 'Email',
 *   type: 'email',
 *   validators: [Validators.required, Validators.email],
 *   errorMessageMap: { required: 'Email is required', email: 'Enter a valid email' },
 * })
 * ```
 */
@Component({
  selector: 'ngs-forms-tw-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigTailwindTextInput> {
  static override key = 'input-text';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  /** The configuration with defaults applied (`type: 'text'`, `labelLocation: 'top'`). */
  textConfig: NgsFormsFormItemConfigTailwindTextInput = ngsDefaults(this.config as NgsFormsFormItemConfigTailwindTextInput, {
    type: 'text',
    labelLocation: 'top',
  });
  /** Whether the label sits to the left of the input. */
  readonly horizontal = this.textConfig.labelLocation === 'left';
  /** The `id` of the `<input>`. */
  readonly inputId = this.id + (this.horizontal ? '-left' : '-top');
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates an `input-text` item. */
  static create(config: NgsFormsFormItemConfigTailwindTextInput): NgsFormsFormItem<NgsFormsFormItemConfigTailwindTextInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemInputComponent.key,
      config,
    };
  }
}
