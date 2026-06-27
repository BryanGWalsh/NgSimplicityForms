import { ChangeDetectorRef, Directive, inject, Injector, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgsFormItemController } from '../../../controllers';
import { INgsFormsFormControlAddRemove, NgsFormsFormControlAddRemoveFunctions } from '../../../misc';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsFormItem } from '../../../models';

@Directive({
  selector: '[ngs-form-item]',
  //templateUrl: "./form-item.component.html",
})

export class NgsFormsFormItemDirective implements OnInit, OnDestroy {
  @Input('ngs-form-item')
  itemData: NgsFormsFormItem<any> | undefined = undefined;

  @Input('ngs-form-group')
  formGroup?: UntypedFormGroup;

  @Input('ngs-form-array')
  formArray?: UntypedFormArray;

  @Input('ngs-form-index')
  index?: number;

  controller: NgsFormItemController | undefined;

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly formComponentRegistryService = inject(NgsFormsComponentRegistryService);

  ngOnInit(): void {
    if (!this.itemData) {
      return console.error('Form item without form data');
    }
    let addRemoveFn: INgsFormsFormControlAddRemove | undefined = undefined;
    if (this.formArray) {
      addRemoveFn = NgsFormsFormControlAddRemoveFunctions.formArray(this.formArray);
    }
    if (this.formGroup) {
      addRemoveFn = NgsFormsFormControlAddRemoveFunctions.formGroup(this.formGroup);
    }
    this.controller = new NgsFormItemController(
      this.injector,
      this.viewContainerRef,
      this.itemData,
      addRemoveFn,
      this.index,
      this.changeDetectorRef
    );
  }

  ngOnDestroy() {
    this.controller?.destroy();
  }
}
