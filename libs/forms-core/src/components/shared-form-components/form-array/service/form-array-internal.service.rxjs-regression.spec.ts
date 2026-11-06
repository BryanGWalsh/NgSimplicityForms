import { TestBed } from '@angular/core/testing';
import { NgsFormsFormArrayInternalService } from './form-array-internal.service';
import { NGS_FORMS_ITEM_DATA } from '../../../../misc';

describe('NgsFormsFormArrayInternalService teardown', () => {
  it('completes itemsChanged on destroy', () => {
    TestBed.configureTestingModule({
      providers: [NgsFormsFormArrayInternalService, { provide: NGS_FORMS_ITEM_DATA, useValue: { uuid: 'a', type: 'form-array', config: { name: 'arr' } } }],
    });
    const service = TestBed.inject(NgsFormsFormArrayInternalService);
    let completed = false;
    service.itemsChanged.subscribe({ complete: () => (completed = true) });
    service.ngOnDestroy();
    expect(completed).toBe(true);
  });
});
