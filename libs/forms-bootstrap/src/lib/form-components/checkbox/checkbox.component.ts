import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigBootstrapCheckbox } from './checkbox.config';
import { v4 } from 'uuid';

/**
 * Bootstrap 5 checkbox (`.form-check`). Its value is `true` or `false` (or `null` before the first change).
 *
 * @remarks Registry key: `checkbox`. Use `Validators.requiredTrue` for "must accept" checkboxes; the error key
 * reported by Angular is `required`.
 */
@Component({
  selector: 'ngs-form-item-bs-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormsItemCheckboxComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapCheckbox> {
  static override key = 'checkbox';
  checkboxConfig = this.config as NgsFormsFormItemConfigBootstrapCheckbox;

  /** Creates a `checkbox` item. */
  static create(
    config: NgsFormsFormItemConfigBootstrapCheckbox
  ): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapCheckbox> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormsItemCheckboxComponent.key,
      config,
    };
  }
}
