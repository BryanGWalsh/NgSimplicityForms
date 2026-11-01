import { NgsFormsFormItem } from './form-item';
import { NgsFormsGlobalFormState } from '../global-state.interface';

/**
 * The top level configuration passed to `NgsFormsService.setFormConfig()`.
 *
 * @example
 * ```ts
 * const config: NgsFormsFormConfig = {
 *   inputUpdateDebounce: 0,
 *   globalState: {},
 *   root: NgsFormsFormGroupComponent.create({ name: 'profile', items: [ ... ] }),
 * };
 * ```
 */
export interface NgsFormsFormConfig<T = NgsFormsFormItem<any>> {
  /**
   * Debounce, in milliseconds, for input value updates.
   *
   * @notImplemented
   * @remarks Reserved for future use: values currently update on every change.
   */
  inputUpdateDebounce: number;
  /** Initial state shared by every component in the form. */
  globalState: NgsFormsGlobalFormState;
  /**
   * The root item, usually an `NgsFormsFormGroupComponent`, whose form group backs the whole form.
   */
  root: T;
  /**
   * Initial form state.
   *
   * @notImplemented
   * @remarks Reserved for future use.
   */
  initialState?: any;
}
