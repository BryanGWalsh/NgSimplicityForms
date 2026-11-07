import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsComponentRegistryService, NgsFormsCoreModule } from '@ng-simplicity/forms-core';
import {
  NgsFormsMaterialFormItemCheckboxComponent,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemSelectInputComponent,
  NgsFormsMaterialRadioInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent,
  NgsFormsMaterialFormItemToggleComponent,
  NgsFormsMaterialFormItemButtonGroupComponent,
  NgsFormsMaterialFormItemRangeComponent,
  NgsFormsMaterialFormItemTypeaheadComponent,
  NgsFormsMaterialFormItemDatepickerComponent,
  NgsFormsMaterialFormItemChipsComponent
} from './form-components';

/** Registration helper for the Angular Material components. */
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsMaterialModule {
  /**
   * Registers the core structural components plus the Material `input-text`, `input-textarea`, `checkbox`,
   * `radio`, `select`, `toggle`, `button-group`, `range`, `typeahead`, `datepicker` and `chips` components.
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
    registryService.register(NgsFormsMaterialFormItemToggleComponent.key, NgsFormsMaterialFormItemToggleComponent);
    registryService.register(NgsFormsMaterialFormItemButtonGroupComponent.key, NgsFormsMaterialFormItemButtonGroupComponent);
    registryService.register(NgsFormsMaterialFormItemRangeComponent.key, NgsFormsMaterialFormItemRangeComponent);
    registryService.register(NgsFormsMaterialFormItemTypeaheadComponent.key, NgsFormsMaterialFormItemTypeaheadComponent);
    registryService.register(NgsFormsMaterialFormItemDatepickerComponent.key, NgsFormsMaterialFormItemDatepickerComponent);
    registryService.register(NgsFormsMaterialFormItemChipsComponent.key, NgsFormsMaterialFormItemChipsComponent);
  }
}
