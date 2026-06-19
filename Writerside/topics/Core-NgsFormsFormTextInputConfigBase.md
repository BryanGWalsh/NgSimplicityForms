# NgsFormsFormItemConfigBaseInput

## Description


## Detail
* Path: `libs/forms-core/src/models/item-config-bases/form-item-input-config-base.model.ts`

## Source
```typescript
export interface NgsFormsFormItemConfigBaseInput extends NgsFormsFormItemConfigBaseItemWithNameAndValidators {
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
}
```
