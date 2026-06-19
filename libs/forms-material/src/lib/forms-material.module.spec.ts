import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import {
  NgsFormsMaterialFormItemCheckboxComponent,
  NgsFormsMaterialFormItemInputComponent,
  NgsFormsMaterialFormItemSelectInputComponent,
  NgsFormsMaterialRadioInputComponent,
  NgsFormsMaterialFormItemTextAreaComponent,
} from './form-components';
import { NgsFormsMaterialModule } from './forms-material.module';

describe('NgsFormsMaterialModule', () => {
  it('should register all Material form item components', () => {
    const registryService = {
      register: jest.fn(),
    } as unknown as NgsFormsComponentRegistryService;

    NgsFormsMaterialModule.registerAllMaterialComponents(registryService);

    expect(registryService.register).toHaveBeenCalledWith(
      NgsFormsMaterialFormItemInputComponent.key,
      NgsFormsMaterialFormItemInputComponent
    );
    expect(registryService.register).toHaveBeenCalledWith(
      NgsFormsMaterialFormItemTextAreaComponent.key,
      NgsFormsMaterialFormItemTextAreaComponent
    );
    expect(registryService.register).toHaveBeenCalledWith(
      NgsFormsMaterialFormItemCheckboxComponent.key,
      NgsFormsMaterialFormItemCheckboxComponent
    );
    expect(registryService.register).toHaveBeenCalledWith(
      NgsFormsMaterialRadioInputComponent.key,
      NgsFormsMaterialRadioInputComponent
    );
    expect(registryService.register).toHaveBeenCalledWith(
      NgsFormsMaterialFormItemSelectInputComponent.key,
      NgsFormsMaterialFormItemSelectInputComponent
    );
  });
});
