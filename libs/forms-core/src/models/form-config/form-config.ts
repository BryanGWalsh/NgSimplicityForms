import { NgsFormsFormItem } from './form-item';
import { NgsFormsGlobalFormState } from '../global-state.interface';

export interface NgsFormsFormConfig<T = NgsFormsFormItem<any>> {
  inputUpdateDebounce: number;
  globalState: NgsFormsGlobalFormState;
  root: T;
  initialState?: any;
}
