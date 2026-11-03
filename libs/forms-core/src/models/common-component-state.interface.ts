/**
 * State that components read through `commonState()`. Set it with `globalState` / `initialState` in the config, or
 * at runtime with `NgsFormsService.updateGlobalState()` and `updateComponentState()`.
 *
 * @remarks The built-in theme components do not read these yet. They are a contract for your own components.
 */
export interface NgsFormsCommonComponentState {
  /**
   * `input` shows the editable control. `summary` shows a compact, read-only display of the current value, for
   * example to save space on small screens.
   */
  displayMode?: 'input' | 'summary';
  /** Whether to show a control that lets the user switch between `summary` and `input`. */
  showEditToggle?: boolean;
}
