import { NgsFormsFormItem } from './form-item';
import { NgsFormsGlobalFormState } from '../global-state.interface';
import { NgsFormsCommonComponentState } from '../common-component-state.interface';

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
  /**
   * Initial state shared by every component in the form. Applied each time `setFormConfig()` is called; change it
   * later with `NgsFormsService.updateGlobalState()`.
   */
  globalState: NgsFormsGlobalFormState;
  /**
   * The root item, usually an `NgsFormsFormGroupComponent`, whose form group backs the whole form.
   */
  root: T;
  /**
   * Initial state for individual components, keyed by item `uuid` or control `name`.
   *
   * @remarks Applied each time `setFormConfig()` is called, together with `globalState`. Same as calling
   * `NgsFormsService.updateComponentState(key, state)` for each entry before the form renders.
   * @example
   * ```ts
   * initialState: { email: { displayMode: 'input' } }
   * ```
   */
  initialState?: { [componentKey: string]: NgsFormsCommonComponentState & { [key: string]: any } };
}
