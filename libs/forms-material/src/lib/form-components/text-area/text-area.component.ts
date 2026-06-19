import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-forms-mat-textarea',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './text-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemTextAreaComponent extends NgsFormsBaseClassFormInputComponent<any> {
  static override key = 'input-textarea';

  static create(config: any): NgsFormsFormItem<any> {
    return {
      uuid: v4(),
      type: NgsFormsMaterialFormItemTextAreaComponent.key,
      config,
    };
  }
}
