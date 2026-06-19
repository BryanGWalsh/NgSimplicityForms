import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../../models';

export interface NgsFormItemRowConfig extends NgsFormsFormItemConfigBase {
  containerClass?: string;
  columnClasses?: Array<string> | string;
  columnClass?: string;
  items: Array<NgsFormsFormItem<any>>
}
