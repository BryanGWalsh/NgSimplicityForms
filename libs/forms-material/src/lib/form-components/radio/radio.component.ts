import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialRadioInputComponent`. */
export interface NgsFormsFormItemConfigMaterialRadio extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Stack options vertically or show them inline.
   * @defaultValue 'vertical'
   */
  alignment?: 'horizontal' | 'vertical';
}

/**
 * Angular Material radio group (`mat-radio-group`). The control's value is the `id` of the chosen option.
 *
 * @remarks Registry key: `radio`.
 */
@Component({
  selector: 'ngs-forms-material-radio-group-input',
  imports: [ReactiveFormsModule, MatRadioModule],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialRadioInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialRadio> {
  static override key = 'radio';
  radioConfig = this.config as NgsFormsFormItemConfigMaterialRadio;

  /** Creates a `radio` item. */
  static create(config: NgsFormsFormItemConfigMaterialRadio): NgsFormsFormItem<NgsFormsFormItemConfigMaterialRadio> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialRadioInputComponent.key,
      config,
    };
  }
}
