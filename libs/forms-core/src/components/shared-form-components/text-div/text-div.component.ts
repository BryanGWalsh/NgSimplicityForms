import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../classes/form-component-base/form-component.class';
import { NgsFormsTextDivConfig } from './text-div-config.model';
import { NgsFormsFormItem } from '../../../models';
import { v4 } from 'uuid';

/**
 * Renders a line of static text, such as a heading or a hint, inside the form.
 *
 * @remarks Registry key: `text-div`. Config: `text` and optional `classes`.
 */
@Component({
  selector: 'ngs-form-component-text-div',
  imports: [],
  templateUrl: './text-div.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTextDivComponent extends NgsFormsBaseClassFormComponent<NgsFormsTextDivConfig> {
  static override key = 'text-div';

  /** Creates a `text-div` item. */
  static create(
    config: NgsFormsTextDivConfig
  ): NgsFormsFormItem<NgsFormsTextDivConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTextDivComponent.key,
      config: config,
    };
  }
  /**
   * Shortcut for a heading: creates a `text-div` with `text` and the given class (default `h2`).
   */
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
