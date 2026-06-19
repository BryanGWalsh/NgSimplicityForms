# Bootstrap Radio

* Default Type Key: ``


## Description



## Config Source
* Path: `libs/forms-bootstrap/src/lib/form-components/radio/radio.config.ts`
```TypeScript
export interface NgsFormsFormsItemConfigBoostrapRadio extends NgsFormsFormItemConfigBaseInput{
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
// From NgsFormsFormItemConfigBaseInputWithOptions
  options?: Array<NgsFormsFormInputOption>;
  options$?: Observable<Array<NgsFormsFormInputOption>>;
// From NgsFormsFormsItemConfigBoostrapRadio  
  alignment?: 'horizontal' | 'vertical'
}
```

## Property Details