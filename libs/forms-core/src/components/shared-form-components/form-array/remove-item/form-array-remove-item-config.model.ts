import { NgsFormsFormItemConfigBase } from '../../../../models';

/** Configuration for `NgsFormsFormArrayRemoveItemComponent`. */
export interface NgsFormItemArrayRemoveItemConfig extends NgsFormsFormItemConfigBase {
  /**
   * Button label.
   * @defaultValue 'Remove'
   */
  buttonText?: string;
  /**
   * Button class.
   * @defaultValue 'btn btn-outline-danger btn-sm'
   */
  buttonClass?: string;
  /** Class of an `<i>` icon shown before the label, for example `bi bi-trash`. */
  buttonIcon?: string;
  /**
   * Accessible name of the button, so screen reader users can tell the rows' buttons apart. A function receives
   * the row's zero-based index.
   * @defaultValue `${buttonText} item ${index + 1}`, for example `Remove item 2`
   */
  ariaLabel?: string | ((index: number) => string);
}
