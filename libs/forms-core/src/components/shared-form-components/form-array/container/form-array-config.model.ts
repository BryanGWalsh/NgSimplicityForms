import { NgsFormsFormItem, NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../../../models';

/** Configuration for `NgsFormsFormArrayContainerComponent`. */
export interface NgsFormItemArrayConfig extends NgsFormsFormItemConfigBaseItemWithNameAndValidators {
  /** Number of rows created when the array first renders. */
  initialItemCount?: number;
  /** Remove buttons do nothing while the array has this many rows or fewer. */
  minItems?: number;
  /** Add buttons do nothing once the array has this many rows. */
  maxItems?: number;
  /** Class for the element that wraps the array's items. */
  containerClass?: string;
  /**
   * Class for each row.
   *
   * @notImplemented
   * @remarks Reserved for future use. Set `containerClass` on `NgsFormsFormArrayListComponent` to style rows.
   */
  itemContainerClass?: string;
  /** Items rendered inside the array: typically a list plus an add button. */
  items: Array<NgsFormsFormItem<any>>;
}

