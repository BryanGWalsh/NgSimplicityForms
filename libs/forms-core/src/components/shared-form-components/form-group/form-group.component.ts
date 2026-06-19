import { Component, ChangeDetectionStrategy, inject, Injector, OnInit, ViewContainerRef } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { v4 } from 'uuid';

import { NgsFormsFormItem, NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../../models';
import { NgsFormsFormItemWithVisibleAndValidatorsBase } from '../../../classes/form-component-base/form-component-item-with-visible-and-validators-base.class';

import { NgsFormsFormItemDirective } from '../../core';


@Component({
  selector: 'ngs-forms-form-group',
  templateUrl: './form-group.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormGroupComponent
  extends NgsFormsFormItemWithVisibleAndValidatorsBase<NgsFormsFormItemConfigBaseItemWithNameAndValidators>
  implements OnInit
{
  static override key = 'form-group';

  static create(
    config: NgsFormsFormItemConfigBaseItemWithNameAndValidators,
    items?: Array<NgsFormsFormItem<any>>
  ): NgsFormsFormItem<NgsFormsFormItemConfigBaseItemWithNameAndValidators> {
    return {
      uuid: v4(),
      type: NgsFormsFormGroupComponent.key,
      config,
      items,
    };
  }

  get formGroupControl(): UntypedFormGroup {
    return this.control as unknown as UntypedFormGroup;
  }

  constructor() {
    super();
    this.control = new UntypedFormGroup({}) as unknown as UntypedFormControl;
  }
}

