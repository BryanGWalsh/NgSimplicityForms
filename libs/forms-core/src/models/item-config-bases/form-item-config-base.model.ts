// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { NgsFormsFormErrorKeyValueMap } from '../errors';
import { Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';
import { NgsFormsFormInputOption } from './form-item-option.model';
import { NgsFormsFormItem } from '../form-config';

export interface NgsFormsFormItemConfigBase {
  uuid?: string;
}

export interface NgsFormsFormItemContainerConfigBase extends NgsFormsFormItemConfigBase {
  items: Array<NgsFormsFormItem<any>>
}

export interface NgsFormsFormItemConfigBaseItemWithNameAndValidators extends NgsFormsFormItemConfigBase{
  name: string;
  errorMessageMap?: NgsFormsFormErrorKeyValueMap;
  disabled?: boolean;
  disabled$?: Observable<boolean>;
  validators?: Array<ValidatorFn>;
  validators$? :Observable<Array<ValidatorFn>>;
}

// ---

export interface NgsFormsFormItemConfigBaseInput extends NgsFormsFormItemConfigBaseItemWithNameAndValidators {
  id?: string;
  label: string;
  value?: unknown;
}

// ---

export interface NgsFormsFormItemConfigBaseTextInput extends NgsFormsFormItemConfigBaseInput {
  placeholder?: string;
  type?: 'text' | 'email' | 'password'
}


export interface NgsFormsFormItemConfigBaseInputWithOptions  extends NgsFormsFormItemConfigBaseInput {
  options?: Array<NgsFormsFormInputOption>;
  options$?: Observable<Array<NgsFormsFormInputOption>>;
}
// --
