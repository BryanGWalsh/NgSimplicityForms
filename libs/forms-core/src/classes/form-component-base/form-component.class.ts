import { Directive, inject, Injector } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { NgsSubscriber } from '../base/subscriber.class';
import { NGS_FORMS_ITEM_DATA } from '../../misc';
import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../models';

/**
 * Root base class for every form item component. Reads the item's configuration from `NGS_FORMS_ITEM_DATA`.
 *
 * @remarks Extend it for components that do not own a form control, such as static content or buttons. Declare a
 * `static key` and a `static create(config)` factory so the component can be registered and used in configs.
 */
@Directive({})
export abstract class NgsFormsBaseClassFormComponent<T extends NgsFormsFormItemConfigBase> extends NgsSubscriber {
  /** Registry key the component is registered under. */
  static key: string;
  /**
   * Element id for this component, handy for `id` and `for` attributes. The config's `id` when it sets one,
   * otherwise a generated unique id.
   */
  id: string;
  /** The item's configuration. */
  protected config: T;
  /** The full form item: `uuid`, `type` and `config`. */
  protected readonly itemData: NgsFormsFormItem<T>;
  constructor() {
    super();
    this.itemData = inject<NgsFormsFormItem<T>>(NGS_FORMS_ITEM_DATA);
    this.config = this.itemData.config;
    this.id = (this.config as { id?: string }).id || uuidv4();
  }
}
