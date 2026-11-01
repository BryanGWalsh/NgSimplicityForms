import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsComponentRegistryService, NgsFormsCoreModule } from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindFormItemCheckboxComponent,
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindFormItemSelectInputComponent,
  NgsFormsTailwindFormItemTextAreaComponent,
  NgsFormsTailwindRadioInputComponent,
} from './form-components';

/** Registration helper for the Tailwind CSS components. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsTailwindModule {
  /**
   * Registers the core structural components plus the Tailwind `input-text`, `input-textarea`, `checkbox`,
   * `radio` and `select` components.
   *
   * @example
   * ```ts
   * constructor() {
   *   NgsFormsTailwindModule.registerAllTailwindComponents(inject(NgsFormsComponentRegistryService));
   * }
   * ```
   */
  static registerAllTailwindComponents(registryService: NgsFormsComponentRegistryService) {
    NgsFormsCoreModule.registerCoreNgsFormComponents(registryService);
    registryService.register(NgsFormsTailwindFormItemCheckboxComponent.key, NgsFormsTailwindFormItemCheckboxComponent);
    registryService.register(NgsFormsTailwindFormItemInputComponent.key, NgsFormsTailwindFormItemInputComponent);
    registryService.register(NgsFormsTailwindRadioInputComponent.key, NgsFormsTailwindRadioInputComponent);
    registryService.register(NgsFormsTailwindFormItemSelectInputComponent.key, NgsFormsTailwindFormItemSelectInputComponent);
    registryService.register(NgsFormsTailwindFormItemTextAreaComponent.key, NgsFormsTailwindFormItemTextAreaComponent);
  }
}
