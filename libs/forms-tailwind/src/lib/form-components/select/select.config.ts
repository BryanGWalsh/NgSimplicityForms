import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsTailwindFormItemSelectInputComponent`. */
export interface NgsFormsFormItemConfigTailwindSelectInput extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Where the label goes: above the select, or to its left in a horizontal row (from the `sm` breakpoint up).
   * @defaultValue 'top'
   */
  labelLocation?: 'top' | 'left';
  /** Text of a disabled first option shown as a prompt. */
  placeholder?: string;
  /**
   * Value of the placeholder option.
   * @defaultValue ''
   */
  placeHolderValue?: string;
  /** Extra classes added to the `<select>`. */
  inputCssClass?: string;
}
