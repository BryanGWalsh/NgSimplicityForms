import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormsFormArrayInternalService } from '../service';
import { AbstractControl, FormArray, UntypedFormGroup } from '@angular/forms';

import { v4 } from 'uuid';
import { NgsFormsFormArrayListConfig } from './form-array-list.config';
import { NgsFormsFormItemDirective, NgsFormsBaseClassFormComponent, NgsFormsFormItem } from '../../../../internal';

@Component({
  selector: 'ngs-forms-form-array-list',
  templateUrl: './form-array-list.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayListComponent extends NgsFormsBaseClassFormComponent<NgsFormsFormArrayListConfig> {
  static override key = 'form-array-list';
  public internalArrayService = inject<NgsFormsFormArrayInternalService>(
    NgsFormsFormArrayInternalService
  );
  public myFormArray: FormArray<any> = this.internalArrayService.formArray;

  static create(
    config: NgsFormsFormArrayListConfig
  ): NgsFormsFormItem<NgsFormsFormArrayListConfig> {
    return {
      uuid: v4(),
      type: NgsFormsFormArrayListComponent.key,
      config: config,
    };
  }

  castToFormGroup(control: AbstractControl): UntypedFormGroup {
    return control as UntypedFormGroup;
  }
}
