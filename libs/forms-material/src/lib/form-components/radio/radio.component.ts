import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

export interface NgsFormsFormItemConfigMaterialRadio extends NgsFormsFormItemConfigBaseInputWithOptions {
  alignment?: 'horizontal' | 'vertical';
}

@Component({
  selector: 'ngs-forms-material-radio-group-input',
  imports: [ReactiveFormsModule, MatRadioModule],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialRadioInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialRadio> {
  static override key = 'radio';
  radioConfig = this.config as NgsFormsFormItemConfigMaterialRadio;

  static create(config: NgsFormsFormItemConfigMaterialRadio): NgsFormsFormItem<NgsFormsFormItemConfigMaterialRadio> {
    return {
      uuid: v4(),
      type: NgsFormsMaterialRadioInputComponent.key,
      config,
    };
  }
}
