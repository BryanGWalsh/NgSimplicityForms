import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsComponentRegistryService, NgsFormsCoreModule } from '@ng-simplicity/forms-core';
import {
  NgsFormsMaterialFormItemCheckboxComponent,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemSelectInputComponent,
  NgsFormsMaterialRadioInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent
} from './form-components';

/** Registration helper for the Angular Material components. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsMaterialModule {
  /**
   * Registers the core structural components plus the Material `input-text`, `input-textarea`, `checkbox`,
   * `radio` and `select` components.
   *
   * @remarks The Material components need animations: add `provideAnimationsAsync()` to your application providers.
   */
  static registerAllMaterialComponents(registryService: NgsFormsComponentRegistryService) {
    NgsFormsCoreModule.registerCoreNgsFormComponents(registryService);
    registryService.register(NgsFormsMaterialFormItemCheckboxComponent.key, NgsFormsMaterialFormItemCheckboxComponent);
    registryService.register(NgsFormsMaterialFormItemInputComponent.key, NgsFormsMaterialFormItemInputComponent);
    registryService.register(NgsFormsMaterialRadioInputComponent.key, NgsFormsMaterialRadioInputComponent);
    registryService.register(NgsFormsMaterialFormItemSelectInputComponent.key, NgsFormsMaterialFormItemSelectInputComponent);
    registryService.register(NgsFormsMaterialFormItemTextAreaComponent.key, NgsFormsMaterialFormItemTextAreaComponent);
  }
}
