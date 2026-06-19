import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { defaults } from 'lodash';
import { NgsFormBootstrapInputComponentResources } from './input-component.resources';
import { NgsFormsFormItemConfigBootstrapTextInput } from './input.config';
import { v4 } from 'uuid';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ngs-forms-bs-input',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapTextInput> {
  static override key = 'input-text';
  textConfig: NgsFormsFormItemConfigBootstrapTextInput = defaults(this.config as NgsFormsFormItemConfigBootstrapTextInput, NgsFormBootstrapInputComponentResources.defaults);
  constructor() {
    super();
  }

  static create(config: NgsFormsFormItemConfigBootstrapTextInput): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapTextInput> {
    return {
      uuid: v4(),
      type: NgsFormsBootstrapFormItemInputComponent.key,
      config,
    };
  }
}
