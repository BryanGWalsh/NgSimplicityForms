import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormInputOption,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/**
 * Configuration for `NgsFormsMaterialFormItemTypeaheadComponent`. The options' labels are the suggestions; use
 * `options$` to load them as the user types.
 */
export interface NgsFormsFormItemConfigMaterialTypeahead extends NgsFormsFormItemConfigBaseInputWithOptions {
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /**
   * Show only the suggestions that contain the typed text (ignoring case). Turn it off when `options$` already
   * returns filtered results.
   * @defaultValue true
   */
  filter?: boolean;
}

/**
 * Angular Material autocomplete (`mat-autocomplete`) on a text input. The value is the text in the input, whether
 * the user picked a suggestion or typed something else.
 *
 * @remarks Registry key: `typeahead`.
 */
@Component({
  selector: 'ngs-forms-mat-typeahead',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './typeahead.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemTypeaheadComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialTypeahead> {
  static override key = 'typeahead';
  typeaheadConfig = this.config as NgsFormsFormItemConfigMaterialTypeahead;
  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: AbstractControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    },
  };

  /** The suggestions for the current text. */
  suggestions(): NgsFormsFormInputOption[] {
    const options = this.options();
    const text = String(this.control?.value ?? '').trim().toLowerCase();
    if (this.typeaheadConfig.filter === false || !text) return options;
    return options.filter((option) => option.label.toLowerCase().includes(text));
  }

  /** Creates a `typeahead` item. */
  static create(config: NgsFormsFormItemConfigMaterialTypeahead): NgsFormsFormItem<NgsFormsFormItemConfigMaterialTypeahead> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemTypeaheadComponent.key,
      config,
    };
  }
}
