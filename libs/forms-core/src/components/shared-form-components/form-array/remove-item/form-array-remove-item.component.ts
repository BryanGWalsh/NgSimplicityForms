import { Component, inject, ChangeDetectionStrategy, ElementRef } from '@angular/core';
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
  private elementRef = inject(ElementRef);
  private indexFromDi = inject<number>(NGS_FORMS_ITEM_INDEX, { optional: true });

  get myIndex(): number {
    if (this.indexFromDi !== null && this.indexFromDi !== undefined) {
      return this.indexFromDi;
    }
    const el = this.elementRef.nativeElement as HTMLElement;
    const container = el.closest('[data-index]');
    if (container) {
      const idxAttr = container.getAttribute('data-index');
      if (idxAttr !== null) {
        return parseInt(idxAttr, 10);
      }
    }
    return 0;
  }

  constructor() {
    super();
  }

  static create(config: NgsFormItemArrayRemoveItemConfig): NgsFormsFormItem<NgsFormItemArrayRemoveItemConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayRemoveItemComponent.key,
      config,
    };
  }

  removeItem() {
    this.internalArrayService.removeAt(this.myIndex);
  }
}
