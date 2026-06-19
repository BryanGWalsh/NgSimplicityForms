import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsFormItemConfigBootstrapSelectInput } from './select.config';

import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-bootstrap-select-input',
  imports: [ReactiveFormsModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemSelectInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigBootstrapSelectInput> {
  static override key = 'select';
  selectConfig = this.config as NgsFormsFormItemConfigBootstrapSelectInput;

  static create(
    config: NgsFormsFormItemConfigBootstrapSelectInput
  ): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapSelectInput> {
    return {
      uuid: v4(),
      type: NgsFormsBootstrapFormItemSelectInputComponent.key,
      config,
    };
  }
}
