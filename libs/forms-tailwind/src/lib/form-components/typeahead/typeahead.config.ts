import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/**
 * Configuration for `NgsFormsTailwindFormItemTypeaheadComponent`. The options' labels are the suggestions; use
 * `options$` to load them as the user types.
 */
export interface NgsFormsFormItemConfigTailwindTypeahead extends NgsFormsFormItemConfigBaseInputWithOptions {
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
}
