import { NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsBootstrapFormItemRangeComponent`. */
export interface NgsFormsFormItemConfigBootstrapRange extends NgsFormsFormItemConfigBaseInput {
  /** @defaultValue 0 */
  min?: number;
  /** @defaultValue 100 */
  max?: number;
  /** @defaultValue 1 */
  step?: number;
  /**
   * Show the current value next to the label.
   * @defaultValue true
   */
  showValue?: boolean;
  /** Text after the shown value, for example `'%'` or `' km'`. */
  valueSuffix?: string;
}
