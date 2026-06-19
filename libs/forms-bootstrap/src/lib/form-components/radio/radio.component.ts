import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { NgsFormsFormsItemConfigBoostrapRadio } from './radio.config';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-bootstrap-radio-group-input',
  imports: [ReactiveFormsModule],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapRadioInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormsItemConfigBoostrapRadio> {
  static override key = 'radio';
  radioConfig = this.config as NgsFormsFormsItemConfigBoostrapRadio;

  static create(
    config: NgsFormsFormsItemConfigBoostrapRadio
  ): NgsFormsFormItem<NgsFormsFormsItemConfigBoostrapRadio> {
    return {
      uuid: v4(),
      type: NgsFormsBootstrapRadioInputComponent.key,
      config,
    };
  }
}
