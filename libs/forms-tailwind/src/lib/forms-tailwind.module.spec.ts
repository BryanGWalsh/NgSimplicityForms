import { NgsFormsComponentRegistryService } from '@ng-simplicity/forms-core';
import {
  NgsFormsTailwindFormItemCheckboxComponent,
  NgsFormsTailwindFormItemInputComponent,
  NgsFormsTailwindFormItemSelectInputComponent,
  NgsFormsTailwindFormItemTextAreaComponent,
  NgsFormsTailwindRadioInputComponent,
} from './form-components';
import { NgsFormsTailwindModule } from './forms-tailwind.module';

describe('NgsFormsTailwindModule', () => {
  it('registers every Tailwind form item component under the shared keys', () => {
    const registryService = { register: jest.fn() } as unknown as NgsFormsComponentRegistryService;

    NgsFormsTailwindModule.registerAllTailwindComponents(registryService);

    const registered = new Map((registryService.register as jest.Mock).mock.calls.map(([key, cmp]) => [key, cmp]));
    expect(registered.get('input-text')).toBe(NgsFormsTailwindFormItemInputComponent);
    expect(registered.get('input-textarea')).toBe(NgsFormsTailwindFormItemTextAreaComponent);
    expect(registered.get('checkbox')).toBe(NgsFormsTailwindFormItemCheckboxComponent);
    expect(registered.get('radio')).toBe(NgsFormsTailwindRadioInputComponent);
    expect(registered.get('select')).toBe(NgsFormsTailwindFormItemSelectInputComponent);
    expect(registered.has('form-group')).toBe(true);
  });
});
