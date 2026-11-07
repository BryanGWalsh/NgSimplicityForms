import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemTextAreaComponent`. */
export interface NgsFormsFormItemConfigMaterialTextArea extends NgsFormsFormItemConfigBaseInput {
  /** Placeholder text shown while the text area is empty. */
  placeholder?: string;
  /**
   * Number of visible text lines.
   * @defaultValue 3
   */
  rows?: number;
}

/**
 * Angular Material text area in an outlined `mat-form-field`.
 *
 * @remarks Registry key: `input-textarea`. Accepts `label`, `placeholder`, `rows` (default 3) and validators.
 */
@Component({
  selector: 'ngs-forms-mat-textarea',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemTextAreaComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialTextArea> {
  static override key = 'input-textarea';

  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: FormControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    }
  };

  /** Creates an `input-textarea` item. */
  static create(config: NgsFormsFormItemConfigMaterialTextArea): NgsFormsFormItem<NgsFormsFormItemConfigMaterialTextArea> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemTextAreaComponent.key,
      config,
    };
  }
}
