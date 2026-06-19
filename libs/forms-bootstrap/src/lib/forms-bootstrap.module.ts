import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgsFormsComponentRegistryService, NgsFormsCoreModule } from '@ng-simplicity/forms-core';
import {
  NgsFormsBootstrapFormItemInputComponent,
  NgsFormsBootstrapFormsItemTextAreaComponent,
  NgsFormsBootstrapFormsItemCheckboxComponent,
  NgsFormsBootstrapRadioInputComponent,
  NgsFormsBootstrapFormItemSelectInputComponent
} from './form-components';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgsFormsCoreModule],
})
export class NgsFormsBootstrapModule {
  static registerAllBootStrapComponents(registryService: NgsFormsComponentRegistryService) {
    NgsFormsCoreModule.registerCoreNgsFormComponents(registryService);
    registryService.register(NgsFormsBootstrapFormsItemCheckboxComponent.key, NgsFormsBootstrapFormsItemCheckboxComponent);
    registryService.register(NgsFormsBootstrapFormItemInputComponent.key, NgsFormsBootstrapFormItemInputComponent);
    registryService.register(NgsFormsBootstrapRadioInputComponent.key, NgsFormsBootstrapRadioInputComponent);
    registryService.register(NgsFormsBootstrapFormItemSelectInputComponent.key, NgsFormsBootstrapFormItemSelectInputComponent);
    registryService.register(NgsFormsBootstrapFormsItemTextAreaComponent.key, NgsFormsBootstrapFormsItemTextAreaComponent);
  }
}
