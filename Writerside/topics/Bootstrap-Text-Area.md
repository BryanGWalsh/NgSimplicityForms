# Bootstrap Text Area

## Default Type Key: `text-area`

## Description



## Config Source
* Path: `libs/forms-bootstrap/src/lib/form-components/text-area/text-area.config.ts`
```TypeScript
export interface NgsFormsFormItemConfigBootstrapTextArea extends NgsFormsFormItemConfigBaseTextInput{
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
// From NgsFormsFormItemConfigBootstrapTextArea
  labelLocation?: 'left' | 'top'
  inputCssClass: string;
} 
```

## Property Details