import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsFormItemConfigBootstrapSelectInput } from './select.config';

import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 } from 'uuid';

/**
 * Bootstrap 5 select (`.form-select`). The control's value is the `id` of the chosen option.
 *
 * @remarks Registry key: `select`. Supports `options$` for options that change at runtime, a disabled
 * `placeholder` option, and `labelLocation`.
 */
@Component({
  selector: 'ngs-forms-bootstrap-select-input',
  imports: [ReactiveFormsModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemSelectInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigBootstrapSelectInput> {
  static override key = 'select';
  selectConfig = this.config as NgsFormsFormItemConfigBootstrapSelectInput;

  /** Creates a `select` item. */
  static create(
    config: NgsFormsFormItemConfigBootstrapSelectInput
  ): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapSelectInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemSelectInputComponent.key,
      config,
    };
  }
}
