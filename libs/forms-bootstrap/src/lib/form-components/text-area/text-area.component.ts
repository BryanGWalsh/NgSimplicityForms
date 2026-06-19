import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { NgsFormsFormItemConfigBootstrapTextArea } from './text-area.config';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-form-item-bs-text-area',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormsItemTextAreaComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapTextArea> {
  static override key = 'input-textarea';
  textAreaConfig = this.config as NgsFormsFormItemConfigBootstrapTextArea;

  static create(config: NgsFormsFormItemConfigBootstrapTextArea): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapTextArea> {
    return {
      uuid: v4(),
      type: NgsFormsBootstrapFormsItemTextAreaComponent.key,
      config,
    };
  }
}
