import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsComponentRegistryService, NgsFormsCoreModule } from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormsItemTextAreaComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapRadioInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent,
  NgsFormsBootstrapFormItemToggleComponent,
  NgsFormsBootstrapFormItemButtonGroupComponent,
  NgsFormsBootstrapFormItemRangeComponent,
  NgsFormsBootstrapFormItemTypeaheadComponent
} from './form-components';

/** Registration helper for the Bootstrap components. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsBootstrapModule {
  /**
   * Registers the core structural components plus the Bootstrap `input-text`, `input-textarea`, `checkbox`,
   * `radio`, `select`, `toggle`, `button-group`, `range` and `typeahead` components.
   *
   * @example
   * ```ts
   * constructor(registry: NgsFormsComponentRegistryService) {
   *   NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
   * }
   * ```
   */
  static registerAllBootStrapComponents(registryService: NgsFormsComponentRegistryService) {
    NgsFormsCoreModule.registerCoreNgsFormComponents(registryService);
    registryService.register(NgsFormsBootstrapFormsItemCheckboxComponent.key, NgsFormsBootstrapFormsItemCheckboxComponent);
    registryService.register(NgsFormsBootstrapFormItemInputComponent.key, NgsFormsBootstrapFormItemInputComponent);
    registryService.register(NgsFormsBootstrapRadioInputComponent.key, NgsFormsBootstrapRadioInputComponent);
    registryService.register(NgsFormsBootstrapFormItemSelectInputComponent.key, NgsFormsBootstrapFormItemSelectInputComponent);
    registryService.register(NgsFormsBootstrapFormsItemTextAreaComponent.key, NgsFormsBootstrapFormsItemTextAreaComponent);
    registryService.register(NgsFormsBootstrapFormItemToggleComponent.key, NgsFormsBootstrapFormItemToggleComponent);
    registryService.register(NgsFormsBootstrapFormItemButtonGroupComponent.key, NgsFormsBootstrapFormItemButtonGroupComponent);
    registryService.register(NgsFormsBootstrapFormItemRangeComponent.key, NgsFormsBootstrapFormItemRangeComponent);
    registryService.register(NgsFormsBootstrapFormItemTypeaheadComponent.key, NgsFormsBootstrapFormItemTypeaheadComponent);
  }
}
