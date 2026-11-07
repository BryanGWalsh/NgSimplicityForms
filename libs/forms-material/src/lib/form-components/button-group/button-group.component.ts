import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemButtonGroupComponent`. */
export interface NgsFormsFormItemConfigMaterialButtonGroup extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Allow more than one option to be chosen. The value is then an array of option ids.
   * @defaultValue false
   */
  multiple?: boolean;
  /**
   * Material button toggle appearance.
   * @defaultValue 'standard'
   */
  appearance?: 'standard' | 'legacy';
}

/**
 * Angular Material button toggle group (`mat-button-toggle-group`). With one choice the value is the chosen
 * option's `id`; with `multiple: true` it is an array of the chosen ids, in option order.
 *
 * @remarks Registry key: `button-group`. `Validators.required` requires a choice, and with `multiple` it also
 * rejects an empty array.
 */
@Component({
  selector: 'ngs-forms-mat-button-group',
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemButtonGroupComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialButtonGroup> {
  static override key = 'button-group';
  groupConfig = this.config as NgsFormsFormItemConfigMaterialButtonGroup;

  /** With `multiple`, puts the chosen ids in option order, so the value does not depend on the order of the clicks. */
  orderValue() {
    const control = this.control;
    const value = control?.value;
    if (!control || !this.groupConfig.multiple || !Array.isArray(value)) return;
    const ordered = this.options().map((o) => o.id).filter((id) => value.includes(id));
    if (ordered.length !== value.length || ordered.some((id, i) => id !== value[i])) {
      control.setValue(ordered);
    }
  }

  /** Creates a `button-group` item. */
  static create(config: NgsFormsFormItemConfigMaterialButtonGroup): NgsFormsFormItem<NgsFormsFormItemConfigMaterialButtonGroup> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemButtonGroupComponent.key,
      config,
    };
  }
}
