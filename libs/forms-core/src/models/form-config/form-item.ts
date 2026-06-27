import { NgsFormsFormItemConfigBase } from '../item-config-bases';

export interface NgsFormsFormItem<T extends NgsFormsFormItemConfigBase> {
  uuid?: string;
  type: string;
  config: T;
}
