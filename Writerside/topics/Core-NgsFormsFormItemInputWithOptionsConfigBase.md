# NgsFormsFormItemConfigBaseInputWithOptions

## Description


## Detail
* Path: `libs/forms-core/src/models/item-config-bases/form-item-text-input-config-base.model.ts`

## Source
```typescript
export interface NgsFormsFormItemConfigBaseInputWithOptions extends NgsFormsFormItemConfigBaseTextInput {
// From NgsFormsFormItemConfigBaseItemWithNameAndValidators
  name: string;
  errorMessageMap?: NgsFormsFormErrorKeyValueMap;
  disabled?: boolean;
  disabled$?: Observable<boolean>;
  validators?: Array<ValidatorFn>;
  validators$? :Observable<Array<ValidatorFn>>;
// From NgsFormsFormItemConfigBaseInput
  id?: string;
  label: string;
  value?: unknown;
// From NgsFormsFormItemConfigBaseTextInput
  placeholder?: string;
// From NgsFormsFormItemConfigBaseInputWithOptions
  options?: Array<NgsFormsFormInputOption>;
  options$?: Observable<Array<NgsFormsFormInputOption>>;
}
```
