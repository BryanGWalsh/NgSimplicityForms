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
  NgsFormsTailwindFormItemToggleComponent,
  NgsFormsTailwindFormItemButtonGroupComponent,
  NgsFormsTailwindFormItemRangeComponent,
  NgsFormsTailwindFormItemTypeaheadComponent,
} from './form-components';

/** Registration helper for the Tailwind CSS components. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsTailwindModule {
  /**
   * Registers the core structural components plus the Tailwind `input-text`, `input-textarea`, `checkbox`,
   * `radio`, `select`, `toggle`, `button-group`, `range` and `typeahead` components.
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
    registryService.register(NgsFormsTailwindFormItemToggleComponent.key, NgsFormsTailwindFormItemToggleComponent);
    registryService.register(NgsFormsTailwindFormItemButtonGroupComponent.key, NgsFormsTailwindFormItemButtonGroupComponent);
    registryService.register(NgsFormsTailwindFormItemRangeComponent.key, NgsFormsTailwindFormItemRangeComponent);
    registryService.register(NgsFormsTailwindFormItemTypeaheadComponent.key, NgsFormsTailwindFormItemTypeaheadComponent);
  }
}
