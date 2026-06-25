import { NgsFormsBaseClassItemsContainerBase } from '../../../classes/form-component-base/form-component-items-container.class';
import { NgsFormsFormSectionConfig, sectionConfigDefaults } from './section-config.interface';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ngsDefaults } from '../../../misc/defaults';
import { v4 } from 'uuid';
import { NgsFormsFormItemDirective } from '../../core';
import { NgsFormsFormItem } from '../../../models';

@Component({
  selector: 'ngs-forms-form-section',
  templateUrl: './section.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormSectionComponent extends NgsFormsBaseClassItemsContainerBase<NgsFormsFormSectionConfig> implements OnInit {
  static override key = 'section';

  static create(config: NgsFormsFormSectionConfig): NgsFormsFormItem<NgsFormsFormSectionConfig> {
    return {
      uuid: v4(),
      type: NgsFormsFormSectionComponent.key,
      config: config,
    };
  }

  ngOnInit() {
    this.config = ngsDefaults(this.config, sectionConfigDefaults);
  }
}
