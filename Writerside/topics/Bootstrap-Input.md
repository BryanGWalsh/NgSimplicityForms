# Bootstrap Input

* Default Type Key: ``


## Description



## Config Source
* Path: `libs/forms-bootstrap/src/lib/form-components/input/input.config.ts`
```TypeScript
export interface NgsFormsFormItemConfigBootstrapTextInput extends NgsFormsFormItemConfigBaseTextInput{
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
  type?: 'text' | 'email' | 'password'
// From NgsFormsFormItemConfigBootstrapTextInput
  labelLocation?: 'left' | 'top'
}
```

## Property Details