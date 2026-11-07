import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NgsFormsFormItemConfigBootstrapButtonGroup } from './button-group.config';

/**
 * Bootstrap 5 button group (`.btn-group` with `.btn-check` inputs). With one choice the value is the chosen
 * option's `id`; with `multiple: true` it is an array of the chosen ids, in option order.
 *
 * @remarks Registry key: `button-group`. `Validators.required` requires a choice, and with `multiple` it also
 * rejects an empty array.
 */
@Component({
  selector: 'ngs-forms-bs-button-group',
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemButtonGroupComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigBootstrapButtonGroup> {
  static override key = 'button-group';
  groupConfig = this.config as NgsFormsFormItemConfigBootstrapButtonGroup;

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
  static create(config: NgsFormsFormItemConfigBootstrapButtonGroup): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapButtonGroup> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemButtonGroupComponent.key,
      config,
    };
  }
}
