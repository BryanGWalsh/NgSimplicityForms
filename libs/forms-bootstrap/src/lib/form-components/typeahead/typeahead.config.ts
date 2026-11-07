import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

/**
 * Configuration for `NgsFormsBootstrapFormItemTypeaheadComponent`. The options' labels are the suggestions; use
 * `options$` to load them as the user types.
 */
export interface NgsFormsFormItemConfigBootstrapTypeahead extends NgsFormsFormItemConfigBaseInputWithOptions {
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
}
