import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, ngsDefaults } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormBootstrapInputComponentResources } from './input-component.resources';
import { NgsFormsFormItemConfigBootstrapTextInput } from './input.config';
import { v4 } from 'uuid';
@Component({
  selector: 'ngs-forms-bs-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapTextInput> {
  static override key = 'input-text';
  textConfig: NgsFormsFormItemConfigBootstrapTextInput = ngsDefaults(this.config as NgsFormsFormItemConfigBootstrapTextInput, NgsFormBootstrapInputComponentResources.defaults);
  constructor() {
    super();
  }

  static create(config: NgsFormsFormItemConfigBootstrapTextInput): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapTextInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemInputComponent.key,
      config,
    };
  }
}
