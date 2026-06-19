# NgsFormsFormItemConfigBaseItemWithNameAndValidators
## Description
Config base class for form controls, form arrays, and form groups


## Detail
* Path: `libs/forms-core/src/models/item-config-bases/form-item-input-config-base.model.ts`


```TypeScript
export interface NgsFormsFormItemConfigBaseItemWithNameAndValidators extends NgsFormsFormItemConfigBase{
  name: string;
  errorMessageMap?: NgsFormsFormErrorKeyValueMap;
  disabled?: boolean;
  disabled$?: Observable<boolean>;
  validators?: Array<ValidatorFn>;
  validators$? :Observable<Array<ValidatorFn>>;
}
```