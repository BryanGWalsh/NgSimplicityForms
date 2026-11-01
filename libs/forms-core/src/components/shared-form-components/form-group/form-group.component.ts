import { Component, ChangeDetectionStrategy, inject, Injector, OnInit, ViewContainerRef } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { v4 } from 'uuid';

import { NgsFormsFormItem, NgsFormsFormGroupConfig } from '../../../models';
import { NgsFormsFormItemWithVisibleAndValidatorsBase } from '../../../classes/form-component-base/form-component-item-with-visible-and-validators-base.class';

import { NgsFormsFormItemDirective } from '../../core';


/**
 * A named group of items backed by an `UntypedFormGroup`. Its value is nested under `name` in the form value.
 *
 * @remarks Registry key: `form-group`. Usually the `root` of a form, and also useful for nesting related fields
 * (an address, for example) or for hiding a whole group with `visible$`.
 * @example
 * ```ts
 * NgsFormsFormGroupComponent.create({
 *   name: 'address',
 *   items: [addressLine1, city, postcode],
 * })
 * ```
 */
@Component({
  selector: 'ngs-forms-form-group',
  templateUrl: './form-group.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormGroupComponent
  extends NgsFormsFormItemWithVisibleAndValidatorsBase<NgsFormsFormGroupConfig>
  implements OnInit
{
  static override key = 'form-group';

  /** Creates a `form-group` item. */
  static create(
    config: NgsFormsFormGroupConfig
  ): NgsFormsFormItem<NgsFormsFormGroupConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormGroupComponent.key,
      config,
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

