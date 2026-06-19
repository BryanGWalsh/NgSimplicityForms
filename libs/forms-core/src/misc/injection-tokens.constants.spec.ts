import { UntypedFormArray, UntypedFormGroup, FormControl } from '@angular/forms';
import { NgsFormsFormControlAddRemoveFunctions } from './injection-tokens.constants';

describe('NgsFormsFormControlAddRemoveFunctions', () => {
  describe('formGroup', () => {
    let formGroup: UntypedFormGroup;
    let addRemoveFn: any;

    beforeEach(() => {
      formGroup = new UntypedFormGroup({});
      addRemoveFn = NgsFormsFormControlAddRemoveFunctions.formGroup(formGroup);
    });

    it('should add a control to FormGroup', () => {
      const control = new FormControl('');
      addRemoveFn.add(control, 'testControl');
      expect(formGroup.get('testControl')).toBe(control);
    });

    it('should remove a control from FormGroup', () => {
      const control = new FormControl('');
      formGroup.addControl('testControl', control);
      expect(formGroup.get('testControl')).toBe(control);

      addRemoveFn.remove(control, 'testControl');
      expect(formGroup.get('testControl')).toBeNull();
    });
  });

  describe('formArray', () => {
    let formArray: UntypedFormArray;
    let addRemoveFn: any;

    beforeEach(() => {
      formArray = new UntypedFormArray([]);
      addRemoveFn = NgsFormsFormControlAddRemoveFunctions.formArray(formArray);
    });

    it('should add a control to FormArray', () => {
      const control = new FormControl('');
      addRemoveFn.add(control, '0');
      expect(formArray.at(0)).toBe(control);
    });

    it('should remove a control from FormArray', () => {
      const control = new FormControl('');
      formArray.push(control);
      expect(formArray.length).toBe(1);

      addRemoveFn.remove(control, '0');
      expect(formArray.length).toBe(0);
    });
  });
});
