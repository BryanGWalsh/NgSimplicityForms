import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgsFormsFormArrayInternalService } from '../service';
import { AbstractControl, FormArray, UntypedFormGroup } from '@angular/forms';

import { v4 } from 'uuid';
import { NgsFormsFormArrayListConfig } from './form-array-list.config';
import { NgsFormsFormItemDirective } from '../../../core';
import { NgsFormsBaseClassFormComponent } from '../../../../classes/form-component-base/form-component.class';
import { NgsFormsFormItem } from '../../../../models';

/**
 * Renders one copy of `templateItem` for every row of the enclosing form array. Each row gets its own form group,
 * so the controls in the template become the properties of each array entry.
 *
 * @remarks Registry key: `form-array-list`. Must be placed inside an `NgsFormsFormArrayContainerComponent`.
 */
@Component({
  selector: 'ngs-forms-form-array-list',
  templateUrl: './form-array-list.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayListComponent extends NgsFormsBaseClassFormComponent<NgsFormsFormArrayListConfig> implements OnInit {
  static override key = 'form-array-list';
  public internalArrayService = inject<NgsFormsFormArrayInternalService>(
    NgsFormsFormArrayInternalService
  );
  public myFormArray: FormArray<any> = this.internalArrayService.formArray;
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.subscribe(this.internalArrayService.itemsChanged, () => {
      this.changeDetectorRef.markForCheck();
    });
  }

  /** Creates a `form-array-list` item. */
  static create(
    config: NgsFormsFormArrayListConfig
  ): NgsFormsFormItem<NgsFormsFormArrayListConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayListComponent.key,
      config: config,
    };
  }

  castToFormGroup(control: AbstractControl): UntypedFormGroup {
    return control as UntypedFormGroup;
  }
}
