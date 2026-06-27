import { inject, Injectable, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgsFormItemArrayConfig } from '../container';
import { NGS_FORMS_ITEM_DATA } from '../../../../misc';
import { NgsFormsFormItem } from '../../../../models/index';
import { Subject } from 'rxjs';

@Injectable()
export class NgsFormsFormArrayInternalService implements OnDestroy {
  config = inject<NgsFormsFormItem<NgsFormItemArrayConfig>>(NGS_FORMS_ITEM_DATA).config;

  readonly formArray = new UntypedFormArray([]);
  readonly itemsChanged = new Subject<void>();

  constructor() {
    if (this.config.initialItemCount) {
      for (let i = 0; i < this.config.initialItemCount; i++) {
        this.addItem();
      }
    }
  }

  ngOnDestroy() {
  }

  removeAt(index: number) {
    if (this.config?.minItems && this.formArray.controls.length <= this.config!.minItems!) {
      return;
    }
    if (!this.formArray.controls.length) {
      return;
    }
    this.formArray.removeAt(index);
    this.itemsChanged.next();
  }
  addItem() {
    if (this.config?.maxItems && this.formArray.controls.length >= this.config!.maxItems) {
      return;
    }
    this.formArray.push(new UntypedFormGroup({}));
    this.itemsChanged.next();
  }
}
