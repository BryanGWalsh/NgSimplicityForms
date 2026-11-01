import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigTailwindCheckbox } from './checkbox.config';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { v4 } from 'uuid';

/**
 * Tailwind CSS checkbox. Its value is `true` or `false` (or `null` before the first change).
 *
 * @remarks Registry key: `checkbox`. Use `Validators.requiredTrue` for "must accept" checkboxes; the error key
 * reported by Angular is `required`.
 */
@Component({
  selector: 'ngs-forms-tw-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemCheckboxComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigTailwindCheckbox> {
  static override key = 'checkbox';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  checkboxConfig = this.config as NgsFormsFormItemConfigTailwindCheckbox;
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates a `checkbox` item. */
  static create(config: NgsFormsFormItemConfigTailwindCheckbox): NgsFormsFormItem<NgsFormsFormItemConfigTailwindCheckbox> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemCheckboxComponent.key,
      config,
    };
  }
}
