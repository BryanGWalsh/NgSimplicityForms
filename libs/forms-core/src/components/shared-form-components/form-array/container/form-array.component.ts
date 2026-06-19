import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsFormItem } from '../../../../models';
import { NgsFormsFormItemDirective } from '../../../core/index';
import { NgsFormItemArrayConfig } from './form-array-config.model';
import { NgsFormsFormItemWithVisibleAndValidatorsBase } from '../../../../classes/form-component-base/form-component-item-with-visible-and-validators-base.class';
import { NgsFormsFormArrayInternalService } from '../service/form-array-internal.service';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-form-array',
  imports: [NgsFormsFormItemDirective],
  templateUrl: './form-array.component.html',
  providers: [NgsFormsFormArrayInternalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayContainerComponent extends NgsFormsFormItemWithVisibleAndValidatorsBase<NgsFormItemArrayConfig> {
  static override key = 'form-array';
  static create(
    config: NgsFormItemArrayConfig
  ): NgsFormsFormItem<NgsFormItemArrayConfig> {
    return {
      uuid: v4(),
      type: NgsFormsFormArrayContainerComponent.key,
      config: config,
    };
  }
}
