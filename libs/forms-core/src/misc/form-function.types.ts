import { Injector } from '@angular/core';
import { UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgsFormsService } from '../services';

export type NgsFormItemVisibilityFn = (params: NgsFormsFunctionParameters) => Observable<boolean> | boolean;
export type NgsFormValidatorArrayBuilderFn = (params: NgsFormsFunctionParameters) => Observable<Array<ValidatorFn>> | Array<ValidatorFn>;
export type NgsFormDisableFn = (params: NgsFormsFunctionParameters) => Observable<boolean> | boolean;

export interface NgsFormsFunctionParameters {
  injector: Injector;
  formGroup: UntypedFormGroup;
  service: NgsFormsService;
}
