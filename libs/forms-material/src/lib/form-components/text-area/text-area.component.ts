import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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

  matcher = {
    isErrorState: (control: FormControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    }
  };

  static create(config: any): NgsFormsFormItem<any> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemTextAreaComponent.key,
      config,
    };
  }
}
