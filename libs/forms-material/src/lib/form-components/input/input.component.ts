import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseTextInput } from '@ng-simplicity/forms-core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemInputComponent`. */
export type NgsFormsFormItemConfigMaterialTextInput = NgsFormsFormItemConfigBaseTextInput;

/**
 * Angular Material text input in an outlined `mat-form-field`, with `mat-error` validation messages.
 *
 * @remarks Registry key: `input-text`. Config: `NgsFormsFormItemConfigMaterialTextInput`
 * (`label`, `placeholder`, `type`, validators).
 */
@Component({
  selector: 'ngs-forms-mat-input',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialTextInput> {
  static override key = 'input-text';

  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: FormControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    }
  };

  /** Creates an `input-text` item. */
  static create(config: NgsFormsFormItemConfigMaterialTextInput): NgsFormsFormItem<NgsFormsFormItemConfigMaterialTextInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemInputComponent.key,
      config,
    };
  }
}
