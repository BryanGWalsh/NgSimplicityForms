import { NgsFormsFormItemConfigBaseTextInput } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsBootstrapFormItemInputComponent`. */
export interface NgsFormsFormItemConfigBootstrapTextInput extends NgsFormsFormItemConfigBaseTextInput {
  /**
   * Where the label goes: above the input, or to its left in a horizontal form row.
   * @defaultValue 'top'
   */
  labelLocation?: 'left' | 'top';
}
