import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../../classes/form-component-base/form-component.class';
import { NgsFormsFormItem } from '../../../../models';
import { NgsFormItemArrayRemoveItemConfig } from './form-array-remove-item-config.model';
import { NgsFormsFormArrayInternalService } from '../service';
import { NGS_FORMS_ITEM_INDEX } from '../../../../misc';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-form-array-remove-item',
  templateUrl: './form-array-remove-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayRemoveItemComponent extends NgsFormsBaseClassFormComponent<NgsFormItemArrayRemoveItemConfig> {
  static override key = 'form-array-remove-item';
  internalArrayService = inject(NgsFormsFormArrayInternalService);
  myIndex = inject<number>(NGS_FORMS_ITEM_INDEX);

  constructor() {
    super();
  }

  static create(config: NgsFormItemArrayRemoveItemConfig): NgsFormsFormItem<NgsFormItemArrayRemoveItemConfig> {
    return {
      uuid: v4(),
      type: NgsFormsFormArrayRemoveItemComponent.key,
      config,
    };
  }

  removeItem() {
    this.internalArrayService.removeAt(this.myIndex);
  }
}
