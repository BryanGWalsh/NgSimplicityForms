import { InjectionToken } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

/** Injection token for the `NgsFormsFormItem` a component is rendering. */
export const NGS_FORMS_ITEM_DATA = new InjectionToken('ngs-forms-item-data');
/**
 * @internal
 */
export const NGS_FORMS_CONTROL_ADD_REMOVE_FN = new InjectionToken('ngs-form-control-remove-fn');
/**
 * Injection token for the row index when a component is rendered inside a form array list.
 *
 * @remarks This is the index the row had when the component was created. Rows before it can be removed later,
 * so to find a row's current position use `NGS_FORMS_ARRAY_ROW` with `formArray.controls.indexOf(row)`.
 */
export const NGS_FORMS_ITEM_INDEX = new InjectionToken<number>('ngs-forms-item-index');
/**
 * Injection token for the `UntypedFormGroup` of the form array row a component is rendered in. Unlike
 * `NGS_FORMS_ITEM_INDEX`, it stays correct when earlier rows are removed.
 */
export const NGS_FORMS_ARRAY_ROW = new InjectionToken<UntypedFormGroup>('ngs-forms-array-row');

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
    add: (control) => formArray.push(control),
    remove: (control) => {
      const index = formArray.controls.indexOf(control);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    },
  }),
};
