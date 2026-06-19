import { Observable } from 'rxjs';
import { NgsFormsFormItemConfigBase } from '../item-config-bases';

export interface NgsFormsFormItem<T extends NgsFormsFormItemConfigBase> {
  uuid?: string;
  type: string;
  config: T;
  visible?: boolean;
  visible$?: Observable<boolean>;
  items?: NgsFormsFormItem<any>[];
  initialState?: any;
}
