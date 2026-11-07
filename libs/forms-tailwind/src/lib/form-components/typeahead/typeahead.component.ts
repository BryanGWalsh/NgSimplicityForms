import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormItemInputWithOptionsComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NGS_FORMS_TAILWIND_CLASSES } from '../../forms-tailwind.classes';
import { ngsTwClassList } from '../../misc/class-list';
import { NgsFormsFormItemConfigTailwindTypeahead } from './typeahead.config';

/**
 * Tailwind CSS text input with suggestions (a `datalist`). The value is the text in the input, whether the user
 * picked a suggestion or typed something else.
 *
 * @remarks Registry key: `typeahead`. The browser filters and shows the suggestions. Disabled options are left out.
 */
@Component({
  selector: 'ngs-forms-tw-typeahead',
  imports: [ReactiveFormsModule],
  templateUrl: './typeahead.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsTailwindFormItemTypeaheadComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigTailwindTypeahead> {
  static override key = 'typeahead';
  /** The classes in use, from `NGS_FORMS_TAILWIND_CLASSES`. */
  readonly classes = inject(NGS_FORMS_TAILWIND_CLASSES);
  /** @internal */
  readonly cx = ngsTwClassList;
  typeaheadConfig = this.config as NgsFormsFormItemConfigTailwindTypeahead;

  /** Creates a `typeahead` item. */
  static create(config: NgsFormsFormItemConfigTailwindTypeahead): NgsFormsFormItem<NgsFormsFormItemConfigTailwindTypeahead> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsTailwindFormItemTypeaheadComponent.key,
      config,
    };
  }
}
