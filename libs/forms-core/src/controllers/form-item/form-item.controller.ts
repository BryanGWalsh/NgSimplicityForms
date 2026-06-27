import { ChangeDetectorRef, ComponentRef, Injector, Provider, ViewContainerRef } from '@angular/core';
import { NgsFormsFormItem } from '../../models';
import { NgsSubscriber } from '../../classes/base/subscriber.class';
import { INgsFormsFormControlAddRemove, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NGS_FORMS_ITEM_DATA, NGS_FORMS_ITEM_INDEX } from '../../misc';
import { BehaviorSubject } from 'rxjs';
import { NgsFormsComponentRegistryService } from '../../services/form-component-registry/form-component-registry.service';

export class NgsFormItemController extends NgsSubscriber {
  private componentRef: ComponentRef<unknown> | undefined;
  private parentVisibility = new BehaviorSubject<boolean>(false);
  private lastVisible: boolean | undefined;

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly itemData: NgsFormsFormItem<any>,
    private readonly addRemoveControlFn?: INgsFormsFormControlAddRemove,
    private readonly index?: number,
    private readonly changeDetectorRef?: ChangeDetectorRef
  ) {
    super();
    this.bindVisibility();
  }

  destroy() {
    this.detach();
    super.ngOnDestroy();
  }

  private bindVisibility() {
    if (!this.itemData.config.visible$) {
      Promise.resolve().then(() => this.create());
      return;
    }
    this.subscribe(this.itemData.config.visible$, (visible: any) => {
      if (this.lastVisible === visible) return;

      this.lastVisible = visible;
      if (visible) {
        Promise.resolve().then(() => this.create());
        return;
      }
      this.detach();
    });
  }

  private create() {
    const providers: Provider[] = [{ provide: NGS_FORMS_ITEM_DATA, useValue: this.itemData }];
    if (this.index !== undefined) {
      providers.push({ provide: NGS_FORMS_ITEM_INDEX, useValue: this.index });
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
    this.parentVisibility.next(true);
  }

  private detach() {
    this.parentVisibility.next(false);
    this.componentRef?.destroy();
    this.changeDetectorRef?.markForCheck();
  }
}
