# Bootstrap Checkbox

* Default Type Key: ``


## Description



## Config Source
* Path: `libs/forms-bootstrap/src/lib/form-components/checkbox/checkbox.config.ts`
```TypeScript
export interface NgsFormsFormItemConfigBootstrapCheckbox extends NgsFormsFormItemConfigBaseInput{
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

## Property Details