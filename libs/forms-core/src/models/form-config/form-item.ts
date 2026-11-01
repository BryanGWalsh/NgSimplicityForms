import { NgsFormsFormItemConfigBase } from '../item-config-bases';

/**
 * A node in the form tree: which registered component to render (`type`) and the configuration to give it.
 *
 * @remarks You rarely build these by hand. Every built-in component has a static `create(config)` factory that
 * returns one with the right `type` and a generated `uuid`.
 */
export interface NgsFormsFormItem<T extends NgsFormsFormItemConfigBase> {
  /** Unique identifier of the node. */
  uuid?: string;
  /**
   * Registry key of the component that renders this item, for example `input-text` or `form-group`.
   */
  type: string;
  /** The configuration handed to the component through the `NGS_FORMS_ITEM_DATA` token. */
  config: T;
}
