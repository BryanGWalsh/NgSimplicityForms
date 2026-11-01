import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../../models';

/** Configuration for `NgsFormsRowComponent`. */
export interface NgsFormItemRowConfig extends NgsFormsFormItemConfigBase {
  /** Class for the element that wraps the whole row. */
  containerClass?: string;
  /** Class for each item's wrapper, matched by index. */
  columnClasses?: Array<string> | string;
  /** Class applied to every item's wrapper. Takes precedence over `columnClasses`. */
  columnClass?: string;
  /** Items to lay out. */
  items: Array<NgsFormsFormItem<any>>
}
