import { NgsFormsFormItemConfigBaseTextInput } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsTailwindFormItemInputComponent`. */
export interface NgsFormsFormItemConfigTailwindTextInput extends NgsFormsFormItemConfigBaseTextInput {
  /**
   * Where the label goes: above the input, or to its left in a horizontal row (from the `sm` breakpoint up).
   * @defaultValue 'top'
   */
  labelLocation?: 'left' | 'top';
  /** Extra classes added to the `<input>`. */
  inputCssClass?: string;
}
