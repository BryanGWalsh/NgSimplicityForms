import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsColumnComponent } from './components/shared-form-components/column';
import { NgsFormsComponentRegistryService } from './services/form-component-registry/form-component-registry.service';
import { NgsFormsFormArrayAddItemComponent } from './components/shared-form-components/form-array/add-item';
import { NgsFormsFormArrayContainerComponent } from './components/shared-form-components/form-array/container';
import { NgsFormsFormArrayListComponent } from './components/shared-form-components/form-array/list';
import { NgsFormsFormArrayRemoveItemComponent } from './components/shared-form-components/form-array/remove-item';
import { NgsFormsFormSectionComponent } from './components/shared-form-components/section/section.component';
import { NgsFormsRowComponent } from './components/shared-form-components/row';
import { NgsFormsTextDivComponent } from './components/shared-form-components/text-div';
import { NgsFormsFormGroupComponent } from './components/shared-form-components/form-group';


/** Registration helpers for the structural components in `@ng-simplicity/forms-core`. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class NgsFormsCoreModule {
  /**
   * Registers the structural components: `form-group`, `form-row`, `column`, `form-array`, `form-array-list`,
   * `form-array-add-item`, `form-array-remove-item`, `text-div` and `section`.
   *
   * @remarks The theme packages call this for you from their own `registerAll…` helpers.
   */
  static registerCoreNgsFormComponents(
    registryService: NgsFormsComponentRegistryService
  ) {
    registryService.register(NgsFormsFormGroupComponent.key, NgsFormsFormGroupComponent);
    registryService.register(NgsFormsRowComponent.key, NgsFormsRowComponent);
    registryService.register(
      NgsFormsColumnComponent.key,
      NgsFormsColumnComponent
    );
    registryService.register(
      NgsFormsFormArrayContainerComponent.key,
      NgsFormsFormArrayContainerComponent
    );
    registryService.register(
      NgsFormsFormArrayAddItemComponent.key,
      NgsFormsFormArrayAddItemComponent
    );
    registryService.register(
      NgsFormsFormArrayRemoveItemComponent.key,
      NgsFormsFormArrayRemoveItemComponent
    );
    registryService.register(
      NgsFormsFormArrayListComponent.key,
      NgsFormsFormArrayListComponent
    );
    registryService.register(
      NgsFormsTextDivComponent.key,
      NgsFormsTextDivComponent
    );
    //registryService.register('content-html', NgsFormsHtmlContentComponent);
    registryService.register(
      NgsFormsFormSectionComponent.key,
      NgsFormsFormSectionComponent
    );
  }
}
