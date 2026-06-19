import { inject, Injectable, OnDestroy } from '@angular/core';

import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgsFormItemArrayConfig } from '../container';

import { INgsFormsFormControlAddRemove, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NGS_FORMS_ITEM_DATA } from '../../../../misc';
import { NgsFormsFormItem } from '../../../../models/index';

@Injectable()
export class NgsFormsFormArrayInternalService implements OnDestroy {
  config = inject<NgsFormsFormItem<NgsFormItemArrayConfig>>(NGS_FORMS_ITEM_DATA).config;

  readonly formArray = new UntypedFormArray([]);
  addRemoveFn = inject<INgsFormsFormControlAddRemove>(NGS_FORMS_CONTROL_ADD_REMOVE_FN);
  constructor() {
    this.addRemoveFn.add(this.formArray, this.config.name);
    if (this.config.initialItemCount) {
      for (let i = 0; i < this.config.initialItemCount; i++) {
        this.addItem();
      }
    }
  }

  ngOnDestroy() {
    this.addRemoveFn.remove(this.formArray, this.config.name);
  }

  removeAt(index: number) {
    if (this.config?.minItems && this.formArray.controls.length <= this.config!.minItems!) {
      return;
    }
    if (!this.formArray.controls.length) {
      return;
    }
    this.formArray.removeAt(index);
  }
  addItem() {
    if (this.config?.maxItems && this.formArray.controls.length >= this.config!.maxItems) {
      return;
    }
    this.formArray.controls.push(new UntypedFormGroup({}));
  }
}
