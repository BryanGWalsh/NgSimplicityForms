import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsBootstrapFormItemSelectInputComponent`. */
export interface NgsFormsFormItemConfigBootstrapSelectInput extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Where the label goes. Any value other than `top` renders the horizontal layout.
   * @defaultValue undefined (horizontal)
   */
  labelLocation?: 'top' | 'left';
  /** Text of a disabled first option shown as a prompt. */
  placeholder?: string;
  /**
   * Value of the placeholder option.
   * @defaultValue ''
   */
  placeHolderValue?: string;
}
