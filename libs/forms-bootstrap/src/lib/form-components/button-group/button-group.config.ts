import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsBootstrapFormItemButtonGroupComponent`. */
export interface NgsFormsFormItemConfigBootstrapButtonGroup extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Allow more than one option to be chosen. The value is then an array of option ids, in option order.
   * @defaultValue false
   */
  multiple?: boolean;
  /**
   * Button variant class for every option.
   * @defaultValue 'btn-outline-primary'
   */
  buttonClass?: string;
  /** Bootstrap button group size. */
  size?: 'sm' | 'lg';
}
