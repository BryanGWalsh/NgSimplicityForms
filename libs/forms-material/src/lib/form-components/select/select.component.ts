import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

export interface NgsFormsFormItemConfigMaterialSelectInput extends NgsFormsFormItemConfigBaseInputWithOptions {
  placeholder?: string;
  placeHolderValue?: string;
}

@Component({
  selector: 'ngs-forms-material-select-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemSelectInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialSelectInput> {
  static override key = 'select';
  selectConfig = this.config as NgsFormsFormItemConfigMaterialSelectInput;

  static create(
    config: NgsFormsFormItemConfigMaterialSelectInput
  ): NgsFormsFormItem<NgsFormsFormItemConfigMaterialSelectInput> {
    return {
      uuid: v4(),
      type: NgsFormsMaterialFormItemSelectInputComponent.key,
      config,
    };
  }
}
