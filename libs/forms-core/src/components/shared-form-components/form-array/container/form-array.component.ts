import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { NgsFormsFormItem } from '../../../../models';
import { NgsFormsFormItemDirective } from '../../../core/index';
import { NgsFormItemArrayConfig } from './form-array-config.model';
import { NgsFormsFormItemWithVisibleAndValidatorsBase } from '../../../../classes/form-component-base/form-component-item-with-visible-and-validators-base.class';
import { NgsFormsFormArrayInternalService } from '../service/form-array-internal.service';
import { v4 } from 'uuid';

/**
 * A repeatable list of rows backed by an `UntypedFormArray`. Its value is an array under `name`.
 *
 * @remarks Registry key: `form-array`. Put an `NgsFormsFormArrayListComponent` inside `items` to render the rows,
 * and `NgsFormsFormArrayAddItemComponent` / `NgsFormsFormArrayRemoveItemComponent` to let users change them.
 */
@Component({
  selector: 'ngs-forms-form-array',
  imports: [NgsFormsFormItemDirective],
  templateUrl: './form-array.component.html',
  providers: [NgsFormsFormArrayInternalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayContainerComponent extends NgsFormsFormItemWithVisibleAndValidatorsBase<NgsFormItemArrayConfig> {
  static override key = 'form-array';

  constructor(private formArrayService: NgsFormsFormArrayInternalService) {
    super();
    this.control = this.formArrayService.formArray as unknown as UntypedFormControl;
  }

  /** Creates a `form-array` item. */
  static create(
    config: NgsFormItemArrayConfig
  ): NgsFormsFormItem<NgsFormItemArrayConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayContainerComponent.key,
      config: config,
    };
  }
}
