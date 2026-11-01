import { Injector } from '@angular/core';
import { UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgsFormsService } from '../services';

/**
 * Function form of a visibility rule.
 *
 * @notImplemented
 * @remarks Reserved for future use. Use `visible$` today.
 */
export type NgsFormItemVisibilityFn = (params: NgsFormsFunctionParameters) => Observable<boolean> | boolean;
/**
 * Function form of a validator rule.
 *
 * @notImplemented
 * @remarks Reserved for future use. Use `validators$` today.
 */
export type NgsFormValidatorArrayBuilderFn = (params: NgsFormsFunctionParameters) => Observable<Array<ValidatorFn>> | Array<ValidatorFn>;
/**
 * Function form of a disable rule.
 *
 * @notImplemented
 * @remarks Reserved for future use.
 */
export type NgsFormDisableFn = (params: NgsFormsFunctionParameters) => Observable<boolean> | boolean;

/** Parameters passed to the function rule types. */
export interface NgsFormsFunctionParameters {
  injector: Injector;
  formGroup: UntypedFormGroup;
  service: NgsFormsService;
}
