import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NgsFormsFormItemConfigBootstrapTypeahead } from './typeahead.config';

/**
 * Bootstrap 5 text input with suggestions (a `datalist`). The value is the text in the input, whether the user
 * picked a suggestion or typed something else.
 *
 * @remarks Registry key: `typeahead`. The browser filters and shows the suggestions. Disabled options are left out.
 */
@Component({
  selector: 'ngs-forms-bs-typeahead',
  imports: [ReactiveFormsModule],
  templateUrl: './typeahead.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemTypeaheadComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigBootstrapTypeahead> {
  static override key = 'typeahead';
  typeaheadConfig = this.config as NgsFormsFormItemConfigBootstrapTypeahead;

  /** Creates a `typeahead` item. */
  static create(config: NgsFormsFormItemConfigBootstrapTypeahead): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapTypeahead> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemTypeaheadComponent.key,
      config,
    };
  }
}
