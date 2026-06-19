import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../../../models/index';

export interface NgsFormsFormArrayListConfig extends NgsFormsFormItemConfigBase {
  templateItem: NgsFormsFormItem<any>;
  containerClass?: string;
}
