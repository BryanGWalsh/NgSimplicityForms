import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  NgsFormsBaseClassFormInputComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInput,
} from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-mat-checkbox',
  imports: [ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemCheckboxComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBaseInput> {
  static override key = 'checkbox';

  static create(config: NgsFormsFormItemConfigBaseInput): NgsFormsFormItem<NgsFormsFormItemConfigBaseInput> {
    return {
      uuid: v4(),
      type: NgsFormsMaterialFormItemCheckboxComponent.key,
      config,
    };
  }
}
