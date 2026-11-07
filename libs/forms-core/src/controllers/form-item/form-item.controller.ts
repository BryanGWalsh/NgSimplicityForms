import { ChangeDetectorRef, ComponentRef, Injector, Provider, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgsFormsFormItem } from '../../models';
import { NgsSubscriber } from '../../classes/base/subscriber.class';
import {
  INgsFormsFormControlAddRemove,
  NGS_FORMS_ARRAY_ROW,
  NGS_FORMS_CONTROL_ADD_REMOVE_FN,
  NGS_FORMS_ITEM_DATA,
  NGS_FORMS_ITEM_INDEX,
} from '../../misc';
import { of } from 'rxjs';
import { NgsFormsComponentRegistryService } from '../../services/form-component-registry/form-component-registry.service';

export class NgsFormItemController extends NgsSubscriber {
  private componentRef: ComponentRef<unknown> | undefined;
  private lastVisible: boolean | undefined;
  /** Incremented whenever a scheduled create becomes stale (hidden again, or destroyed). */
  private createToken = 0;
  private destroyed = false;

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly itemData: NgsFormsFormItem<any>,
    private readonly addRemoveControlFn?: INgsFormsFormControlAddRemove,
    private readonly index?: number,
    private readonly changeDetectorRef?: ChangeDetectorRef,
    private readonly arrayRow?: UntypedFormGroup
  ) {
    super();
    this.bindVisibility();
  }

  destroy() {
    this.destroyed = true;
    this.createToken++;
    this.detach();
    super.ngOnDestroy();
  }

  private bindVisibility() {
    const config = this.itemData.config;
    const visible$ = config.visible$ ?? (config.visible !== undefined ? of(config.visible) : undefined);
    if (!visible$) {
      this.scheduleCreate();
      return;
    }
    this.subscribe(visible$, (visible: any) => {
      if (this.lastVisible === visible) return;

      this.lastVisible = visible;
      if (visible) {
        this.scheduleCreate();
        return;
      }
      // Cancels a create that was scheduled but has not run yet.
      this.createToken++;
      this.detach();
    });
  }

  /**
   * Creates the component in a microtask. A create that is overtaken by a later visibility change or by
   * `destroy()` before it runs is dropped.
   */
  private scheduleCreate() {
    const token = ++this.createToken;
    Promise.resolve().then(() => {
      if (this.destroyed || token !== this.createToken) return;
      this.create();
    });
  }

  private create() {
    if (this.componentRef && !this.componentRef.hostView.destroyed) {
      return;
    }
    const providers: Provider[] = [{ provide: NGS_FORMS_ITEM_DATA, useValue: this.itemData }];
    if (this.index !== undefined) {
      providers.push({ provide: NGS_FORMS_ITEM_INDEX, useValue: this.index });
    }
    if (this.arrayRow) {
      providers.push({ provide: NGS_FORMS_ARRAY_ROW, useValue: this.arrayRow });
    }
    if (this.addRemoveControlFn) {
      providers.push({ provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: this.addRemoveControlFn });
    }
    const myInjector = Injector.create({
      parent: this.injector,
      providers,
    });
    const componentType = this.injector.get(NgsFormsComponentRegistryService).getComponentTypeForKey(this.itemData.type);
    if (!componentType) {
      console.error(`Ngs form component type ${this.itemData.type} not registered.`);
      return;
    }
    this.componentRef = this.viewContainerRef.createComponent(componentType, { injector: myInjector });
    this.componentRef.changeDetectorRef?.detectChanges();
    this.changeDetectorRef?.markForCheck();
  }

  private detach() {
    this.componentRef?.destroy();
    this.componentRef = undefined;
    this.changeDetectorRef?.markForCheck();
  }
}
