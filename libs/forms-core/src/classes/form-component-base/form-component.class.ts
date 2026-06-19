import { Directive, inject, Injector } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { NgsSubscriber } from '../base/subscriber.class';
import { NGS_FORMS_ITEM_DATA } from '../../misc';
import { NgsFormsFormItem, NgsFormsFormItemConfigBase } from '../../models';

@Directive({})
export abstract class NgsFormsBaseClassFormComponent<T extends NgsFormsFormItemConfigBase> extends NgsSubscriber {
  static key: string;
  id = uuidv4();
  protected config: T;
  protected readonly itemData: NgsFormsFormItem<T>;
  constructor() {
    super();
    this.itemData = inject<NgsFormsFormItem<T>>(NGS_FORMS_ITEM_DATA);
    this.config = this.itemData.config;
  }
}
