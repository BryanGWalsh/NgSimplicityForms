import { FormControl, UntypedFormArray } from '@angular/forms';
import { NgsFormsFormControlAddRemoveFunctions } from './injection-tokens.constants';

describe('NgsFormsFormControlAddRemoveFunctions.formArray values', () => {
  it('added control contributes to the array value', () => {
    const arr = new UntypedFormArray([]);
    NgsFormsFormControlAddRemoveFunctions.formArray(arr).add(new FormControl('x'), 'n');
    expect(arr.value).toEqual(['x']);
  });

  it('added control has the array as parent (its changes reach the array)', () => {
    const arr = new UntypedFormArray([]);
    const c = new FormControl('x');
    NgsFormsFormControlAddRemoveFunctions.formArray(arr).add(c, 'n');
    c.setValue('y');
    expect(c.parent).toBe(arr);
    expect(arr.value).toEqual(['y']);
  });

  it('removing a control that is not in the array leaves other controls alone', () => {
    const a = new FormControl('a');
    const arr = new UntypedFormArray([a]);
    NgsFormsFormControlAddRemoveFunctions.formArray(arr).remove(new FormControl('other'), 'n');
    expect(arr.controls).toEqual([a]);
  });
});
