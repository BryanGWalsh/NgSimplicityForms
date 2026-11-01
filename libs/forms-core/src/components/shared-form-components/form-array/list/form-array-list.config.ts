import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../../../models/index';

/** Configuration for `NgsFormsFormArrayListComponent`. */
export interface NgsFormsFormArrayListConfig extends NgsFormsFormItemConfigBase {
  /** The item rendered for each row, usually a row or column of inputs. */
  templateItem: NgsFormsFormItem<any>;
  /** Class for the element that wraps each row. */
  containerClass?: string;
}
