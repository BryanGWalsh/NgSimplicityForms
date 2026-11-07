import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { NgsFormsFormItemConfigTailwindButtonGroup } from './button-group.config';

/**
 * Tailwind CSS segmented button group. With one choice the value is the chosen option's `id`; with
 * `multiple: true` it is an array of the chosen ids, in option order.
 *
 * @remarks Registry key: `button-group`. Each button wraps a visually hidden radio or checkbox, so keyboard and
 * screen reader behaviour is native. `Validators.required` requires a choice, and with `multiple` it also rejects an
 * empty array.
 */
@Component({
  selector: 'ngs-forms-tw-button-group',
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemButtonGroupComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigTailwindButtonGroup> {
  static override key = 'button-group';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  /** @internal */
  readonly cx = ngsTwClassList;
  groupConfig = this.config as NgsFormsFormItemConfigTailwindButtonGroup;

  /** Whether the option with `optionId` is chosen. */
  isSelected(optionId: string | number): boolean {
    const value = this.control?.value;
    return this.groupConfig.multiple ? Array.isArray(value) && value.includes(optionId) : value === optionId;
  }

  /** Chooses the option (one choice) or adds or removes it (multiple). */
  choose(optionId: string | number) {
    const control = this.control;
    if (!control) return;
    let next: unknown = optionId;
    if (this.groupConfig.multiple) {
      const current = Array.isArray(control.value) ? control.value : [];
      const chosen = current.includes(optionId) ? current.filter((id: unknown) => id !== optionId) : [...current, optionId];
      // Keep option order, so the value does not depend on the order of the clicks.
      next = this.options().map((o) => o.id).filter((id) => chosen.includes(id));
    }
    control.markAsDirty();
    control.setValue(next);
  }

  /** Marks the control as touched when focus leaves it. */
  touch() {
    this.control?.markAsTouched();
  }

  /** Creates a `button-group` item. */
  static create(config: NgsFormsFormItemConfigTailwindButtonGroup): NgsFormsFormItem<NgsFormsFormItemConfigTailwindButtonGroup> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemButtonGroupComponent.key,
      config,
    };
  }
}
