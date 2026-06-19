import { NgsFormsFormItem, NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../../../models';

export interface NgsFormItemArrayConfig extends NgsFormsFormItemConfigBaseItemWithNameAndValidators {
  initialItemCount?: number;
  minItems?: number;
  maxItems?: number;
  containerClass?: string;
  itemContainerClass?: string;
  items: Array<NgsFormsFormItem<any>>;
}

