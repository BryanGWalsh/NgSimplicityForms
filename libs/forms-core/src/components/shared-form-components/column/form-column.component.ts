import { NgsFormsBaseClassItemsContainerBase } from '../../../classes/form-component-base/form-component-items-container.class';
import { NgsFormsFormItem, NgsFormsFormItemContainerConfigBase } from '../../../models';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { v4 } from 'uuid';
import { NgsFormsFormItemDirective } from '../../core';

@Component({
  selector: 'ngs-form-component-column',
  templateUrl: './form-column.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsColumnComponent extends NgsFormsBaseClassItemsContainerBase<NgsFormsFormItemContainerConfigBase> {
  static override key = 'column';

  static create(config: NgsFormsFormItemContainerConfigBase): NgsFormsFormItem<NgsFormsFormItemContainerConfigBase> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsColumnComponent.key,
      config,
    };
  }
}
