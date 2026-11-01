import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { NgsFormsFormsItemConfigBoostrapRadio } from './radio.config';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 } from 'uuid';

/**
 * Bootstrap 5 radio group. The control's value is the `id` of the chosen option.
 *
 * @remarks Registry key: `radio`. Set `alignment: 'horizontal'` to show the options inline.
 */
@Component({
  selector: 'ngs-forms-bootstrap-radio-group-input',
  imports: [ReactiveFormsModule],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapRadioInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormsItemConfigBoostrapRadio> {
  static override key = 'radio';
  radioConfig = this.config as NgsFormsFormsItemConfigBoostrapRadio;

  /** Creates a `radio` item. */
  static create(
    config: NgsFormsFormsItemConfigBoostrapRadio
  ): NgsFormsFormItem<NgsFormsFormsItemConfigBoostrapRadio> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapRadioInputComponent.key,
      config,
    };
  }
}
