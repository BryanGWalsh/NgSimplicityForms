import { NgsFormsFormItemConfigBase } from '../../../../models';

/** Configuration for `NgsFormsFormArrayAddItemComponent`. */
export interface NgsFormItemArrayAddItemConfig extends NgsFormsFormItemConfigBase {
  /**
   * Button label.
   * @defaultValue 'Add Item'
   */
  buttonText?: string;
  /**
   * Button class.
   * @defaultValue 'btn btn-outline-primary'
   */
  buttonClass?: string;
  /** Class of an `<i>` icon shown before the label, for example `bi bi-plus`. */
  buttonIcon?: string;
}
