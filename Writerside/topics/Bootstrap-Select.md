# Bootstrap Select

* Default Type Key: ``


## Description



## Config Source
* Path: `libs/forms-bootstrap/src/lib/form-components/select/select.config.ts`
```TypeScript
export interface NgsFormsFormItemConfigBootstrapSelectInput extends NgsFormsFormItemConfigBaseInput{
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
// From NgsFormsFormItemConfigBootstrapSelectInput 
  labelLocation?: 'top' | 'left';
  placeholder?: boolean;
  placeHolderValue?: string;
}
```

## Property Details