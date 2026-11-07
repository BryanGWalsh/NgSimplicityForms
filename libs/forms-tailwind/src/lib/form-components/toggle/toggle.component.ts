import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { NgsFormsFormItemConfigTailwindToggle } from './toggle.config';

/**
 * Tailwind CSS toggle switch: a checkbox drawn as a switch. Its value is `true` or `false` (or `null` before the
 * first change).
 *
 * @remarks Registry key: `toggle`. Exposed to assistive technology as a switch.
 */
@Component({
  selector: 'ngs-forms-tw-toggle',
  imports: [ReactiveFormsModule],
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemToggleComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigTailwindToggle> {
  static override key = 'toggle';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  /** @internal */
  readonly cx = ngsTwClassList;

  /** Creates a `toggle` item. */
  static create(config: NgsFormsFormItemConfigTailwindToggle): NgsFormsFormItem<NgsFormsFormItemConfigTailwindToggle> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemToggleComponent.key,
      config,
    };
  }
}
