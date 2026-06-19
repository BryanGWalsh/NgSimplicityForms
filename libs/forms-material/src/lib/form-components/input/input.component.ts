import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-mat-input',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemInputComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'input-text';

  static create(config: any): NgsFormsFormItem<any> {
    return {
      uuid: v4(),
      type: NgsFormsMaterialFormItemInputComponent.key,
      config,
    };
  }
}
