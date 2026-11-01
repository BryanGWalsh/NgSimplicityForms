import { ChangeDetectorRef, Directive, inject, Injector, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgsFormItemController } from '../../../controllers';
import { INgsFormsFormControlAddRemove, NgsFormsFormControlAddRemoveFunctions } from '../../../misc';
import { NgsFormsComponentRegistryService } from '../../../services/form-component-registry/form-component-registry.service';
import { NgsFormsFormItem } from '../../../models';

/**
 * Structural building block that looks up a form item's component in the registry and renders it.
 *
 * @remarks Use it inside custom container components to render child items:
 * `<ng-container [ngs-form-item]="item" [ngs-form-group]="group"></ng-container>`.
 */
@Directive({
  selector: '[ngs-form-item]',
  //templateUrl: "./form-item.component.html",
})

export class NgsFormsFormItemDirective implements OnInit, OnDestroy {
  /** The item to render. */
  @Input('ngs-form-item')
  itemData: NgsFormsFormItem<any> | undefined = undefined;

  /** Form group that the item's control is added to. */
  @Input('ngs-form-group')
  formGroup?: UntypedFormGroup;

  /** Form array that the item's control is added to. */
  @Input('ngs-form-array')
  formArray?: UntypedFormArray;

  /**
   * Index of the item inside a form array row, provided to children as `NGS_FORMS_ITEM_INDEX`.
   */
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
