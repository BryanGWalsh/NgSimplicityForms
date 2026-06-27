import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsFormItemConfigBootstrapCheckbox } from './checkbox.config';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-form-item-bs-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormsItemCheckboxComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapCheckbox> {
  static override key = 'checkbox';
  checkboxConfig = this.config as NgsFormsFormItemConfigBootstrapCheckbox;

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
