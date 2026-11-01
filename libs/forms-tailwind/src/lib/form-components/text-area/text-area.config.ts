import { NgsFormsFormItemConfigBaseTextInput } from '@ng-simplicity/forms-core';

/** Configuration for `NgsFormsTailwindFormItemTextAreaComponent`. */
export interface NgsFormsFormItemConfigTailwindTextArea extends NgsFormsFormItemConfigBaseTextInput {
  /**
   * Where the label goes.
   * @defaultValue 'top'
   */
  labelLocation?: 'left' | 'top';
  /** Extra classes added to the `<textarea>`. */
  inputCssClass?: string;
}
