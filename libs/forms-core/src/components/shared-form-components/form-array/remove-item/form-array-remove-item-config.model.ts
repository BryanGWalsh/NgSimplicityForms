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
}
