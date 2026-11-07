import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsTailwindFormItemButtonGroupComponent`. */
export interface NgsFormsFormItemConfigTailwindButtonGroup extends NgsFormsFormItemConfigBaseInputWithOptions {
  /**
   * Allow more than one option to be chosen. The value is then an array of option ids, in option order.
   * @defaultValue false
   */
  multiple?: boolean;
}
