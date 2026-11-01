import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemSelectInputComponent`. */
export interface NgsFormsFormItemConfigMaterialSelectInput extends NgsFormsFormItemConfigBaseInputWithOptions {
  /** Text of a disabled first option shown as a prompt. */
  placeholder?: string;
  /**
   * Value of the placeholder option.
   * @defaultValue ''
   */
  placeHolderValue?: string;
}

/**
 * Angular Material select (`mat-select`) in an outlined `mat-form-field`. Supports `options$`.
 *
 * @remarks Registry key: `select`.
 */
@Component({
  selector: 'ngs-forms-material-select-input',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemSelectInputComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<NgsFormsFormItemConfigMaterialSelectInput> {
  static override key = 'select';
  selectConfig = this.config as NgsFormsFormItemConfigMaterialSelectInput;

  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: FormControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    }
  };

  /** Creates a `select` item. */
  static create(
    config: NgsFormsFormItemConfigMaterialSelectInput
  ): NgsFormsFormItem<NgsFormsFormItemConfigMaterialSelectInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemSelectInputComponent.key,
      config,
    };
  }
}
