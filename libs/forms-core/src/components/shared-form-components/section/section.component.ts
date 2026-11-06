import { NgsFormsBaseClassItemsContainerBase } from '../../../classes/form-component-base/form-component-items-container.class';
import { NgsFormsFormSectionConfig, sectionConfigDefaults } from './section-config.interface';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ngsDefaults } from '../../../misc/defaults';
import { v4 } from 'uuid';
import { NgsFormsFormItemDirective } from '../../core';
import { NgsFormsFormItem } from '../../../models';

/**
 * Groups items under a title and optional subtitle. Does not create a form control, so child values stay in the
 * parent group.
 *
 * @remarks Registry key: `section`. Config: `title`, `subtitle`, `titleClass` (default `h3`),
 * `headingLevel` (default 3), `subtitleClass` (default `lead`) and `items`. The section is exposed to assistive
 * technology as a group named by its title.
 */
@Component({
  selector: 'ngs-forms-form-section',
  templateUrl: './section.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormSectionComponent extends NgsFormsBaseClassItemsContainerBase<NgsFormsFormSectionConfig> implements OnInit {
  static override key = 'section';
  /** Element id of the title, used to name the section's group. */
  readonly titleId = `${this.itemData.uuid || v4()}-section-title`;

  /** Creates a `section` item. */
  static create(config: NgsFormsFormSectionConfig): NgsFormsFormItem<NgsFormsFormSectionConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormSectionComponent.key,
      config: config,
    };
  }

  ngOnInit() {
    this.config = ngsDefaults(this.config, sectionConfigDefaults);
  }
}
