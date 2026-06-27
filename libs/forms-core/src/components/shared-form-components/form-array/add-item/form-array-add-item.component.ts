import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../../classes/form-component-base/form-component.class';
import { NgsFormsFormItem } from '../../../../models';
import { NgsFormItemArrayAddItemConfig } from './form-array-add-item-config.model';
import { NgsFormsFormArrayInternalService } from '../service/form-array-internal.service';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-form-array-add-item',
  templateUrl: './form-array-add-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayAddItemComponent extends NgsFormsBaseClassFormComponent<NgsFormItemArrayAddItemConfig> {
  static override key = 'form-array-add-item';
  internalArrayService = inject(NgsFormsFormArrayInternalService);

  static create(config: NgsFormItemArrayAddItemConfig): NgsFormsFormItem<NgsFormItemArrayAddItemConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayAddItemComponent.key,
      config: config,
    };
  }

  addItem() {
    this.internalArrayService.addItem();
  }
}
