import { NgsFormsFormItemConfigBaseInputWithOptions } from '@ng-simplicity/forms-core';

export interface NgsFormsFormItemConfigBootstrapSelectInput extends NgsFormsFormItemConfigBaseInputWithOptions {
  labelLocation?: 'top' | 'left';
  placeholder?: string;
  placeHolderValue?: string;
}
