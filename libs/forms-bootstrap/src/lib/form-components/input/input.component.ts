import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, ngsDefaults } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormBootstrapInputComponentResources } from './input-component.resources';
import { NgsFormsFormItemConfigBootstrapTextInput } from './input.config';
import { v4 } from 'uuid';
/**
 * Bootstrap 5 text input (`.form-control`) with a label and inline validation message.
 *
 * @remarks Registry key: `input-text`. Supports `type` (`text`, `email`, `password`) and `labelLocation`
 * (`top`, the default, or `left` for a horizontal `col-sm-2` / `col-sm-10` layout).
 * @example
 * ```ts
 * NgsFormsBootstrapFormItemInputComponent.create({
 *   name: 'email',
 *   label: 'Email',
 *   type: 'email',
 *   validators: [Validators.required, Validators.email],
 *   errorMessageMap: { required: 'Email is required', email: 'Enter a valid email' },
 * })
 * ```
 */
@Component({
  selector: 'ngs-forms-bs-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapTextInput> {
  static override key = 'input-text';
  /** The configuration with defaults applied (`type: 'text'`, `labelLocation: 'top'`). */
  textConfig: NgsFormsFormItemConfigBootstrapTextInput = ngsDefaults(this.config as NgsFormsFormItemConfigBootstrapTextInput, NgsFormBootstrapInputComponentResources.defaults);
  constructor() {
    super();
  }

  /** Creates an `input-text` item. */
  static create(config: NgsFormsFormItemConfigBootstrapTextInput): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapTextInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemInputComponent.key,
      config,
    };
  }
}
