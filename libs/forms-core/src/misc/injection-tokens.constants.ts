import { InjectionToken } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

/** Injection token for the `NgsFormsFormItem` a component is rendering. */
export const NGS_FORMS_ITEM_DATA = new InjectionToken('ngs-forms-item-data');
/**
 * @internal
 */
export const NGS_FORMS_CONTROL_ADD_REMOVE_FN = new InjectionToken('ngs-form-control-remove-fn');
/** Injection token for the row index when a component is rendered inside a form array list. */
export const NGS_FORMS_ITEM_INDEX = new InjectionToken('ngs-forms-item-index');

type FormControlAddRemoveFn = (control: AbstractControl, controlName: string) => void;

/**
 * @internal
 */
export interface INgsFormsFormControlAddRemove {
  add: FormControlAddRemoveFn;
  remove: FormControlAddRemoveFn;
}
interface IControlAddRemoveFunctionsBuilder {
  formGroup: (formGroup: UntypedFormGroup) => INgsFormsFormControlAddRemove;
  formArray: (formArray: UntypedFormArray) => INgsFormsFormControlAddRemove;
}
/**
 * @internal
 */
export const NgsFormsFormControlAddRemoveFunctions: IControlAddRemoveFunctionsBuilder = {
  formGroup: (formGroup) => ({
    add: (control, controlName) => formGroup.addControl(controlName, control),
    remove: (control, controlName) => formGroup.removeControl(controlName),
  }),
  formArray: (formArray: UntypedFormArray) => ({
    add: (control, controlName) => formArray.controls.push(control),
    remove: (control, controlName) => {
      const index = formArray.controls.indexOf(control);
      formArray.controls.splice(index, 1);
    },
  }),
};
