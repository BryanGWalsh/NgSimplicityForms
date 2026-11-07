import { fakeAsync, tick } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { NgsFormsService } from './forms.service';
import { NgsFormsInternalService } from '../internal/internal-forms.service';

describe('NgsFormsService subscriptions', () => {
  it('unsubscribes from internal formGroup$ on destroy', () => {
    const service = new NgsFormsService();
    const internal = new NgsFormsInternalService();
    service.setInternalService(internal);
    service.ngOnDestroy();
    expect(internal.formGroup$.observed).toBe(false);
  });

  it('re-connecting a new <ngs-form> releases the previous internal service', () => {
    const service = new NgsFormsService();
    const first = new NgsFormsInternalService();
    const second = new NgsFormsInternalService();
    service.setInternalService(first);
    service.setInternalService(second);
    expect(first.formGroup$.observed).toBe(false);
  });

  it('completes formValue$ on destroy', () => {
    const service = new NgsFormsService();
    let completed = false;
    service.formValue$.subscribe({ complete: () => (completed = true) });
    service.ngOnDestroy();
    expect(completed).toBe(true);
  });

  it('cancels pending setFormConfig retries on destroy', fakeAsync(() => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const service = new NgsFormsService();
    service.setFormConfig({ root: {} } as any);
    service.ngOnDestroy();
    tick(1000);
    expect(err).not.toHaveBeenCalled();
    err.mockRestore();
  }));

  it('a setFormConfig retry does not overwrite a later direct setFormConfig', fakeAsync(() => {
    const service = new NgsFormsService();
    const internal = new NgsFormsInternalService();
    const a = { root: { a: 1 } } as any;
    const b = { root: { b: 1 } } as any;
    service.setFormConfig(a); // queued retry
    service.setInternalService(internal);
    service.setFormConfig(b); // applied immediately
    tick(100);
    expect(internal.formConfig$.value).toBe(b);
  }));
});
