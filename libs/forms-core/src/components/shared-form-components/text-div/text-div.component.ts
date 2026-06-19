import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../classes/form-component-base/form-component.class';
import { NgsFormsTextDivConfig } from './text-div-config.model';
import { NgsFormsFormItem } from '../../../models';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-form-component-text-div',
  imports: [],
  templateUrl: './text-div.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTextDivComponent extends NgsFormsBaseClassFormComponent<NgsFormsTextDivConfig> {
  static override key = 'text-div';

  static create(
    config: NgsFormsTextDivConfig
  ): NgsFormsFormItem<NgsFormsTextDivConfig> {
    return {
      uuid: v4(),
      type: NgsFormsTextDivComponent.key,
      config: config,
    };
  }
  static title(
    title: string,
    divClass = 'h2'
  ): NgsFormsFormItem<NgsFormsTextDivConfig> {
    return NgsFormsTextDivComponent.create({
      text: title,
      classes: divClass,
    });
  }
}
