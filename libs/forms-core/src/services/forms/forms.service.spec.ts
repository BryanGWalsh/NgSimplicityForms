import { TestBed } from '@angular/core/testing';
import { NgsFormsService } from './forms.service';
import { NgsFormsInternalService } from '../internal/internal-forms.service';
import { FormGroup, UntypedFormGroup } from '@angular/forms';

describe('NgsFormsService', () => {
  let service: NgsFormsService;
  let mockInternalService: NgsFormsInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgsFormsService,
        NgsFormsInternalService
      ]
    });
    service = TestBed.inject(NgsFormsService);
    mockInternalService = TestBed.inject(NgsFormsInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial empty values and dirty=false', () => {
    expect(service.dirty).toBe(false);
    expect(service.isValid).toBe(false);
    expect(service.formValue).toEqual({});
  });

  it('should return false for isValid if internal service is not set', () => {
    expect(service.internalServiceIsSet).toBe(false);
    expect(service.isValid).toBe(false);
  });

  it('should delegate checkIsValid to internal service if set', () => {
    service.setInternalService(mockInternalService);
    const checkIsValidSpy = jest.spyOn(mockInternalService, 'checkIsValid').mockReturnValue(true);
    expect(service.isValid).toBe(true);
    expect(checkIsValidSpy).toHaveBeenCalled();
  });

  it('should bind the form group from internal service and receive value changes', () => {
    const testFormGroup = new UntypedFormGroup({});
    service.setInternalService(mockInternalService);
    
    // Emit new form group
    mockInternalService.formGroup$.next(testFormGroup);
    
    // Should update formGroup internal binding
    expect(service.dirty).toBe(false);

    // Value changes testing
    const testValue = { key: 'value' };
    let emittedValue: any = null;
    service.formValue$.subscribe(v => emittedValue = v);

    // Patch or set value to trigger valueChanges
    testFormGroup.addControl('key', new FormGroup({})); // just to allow setting key
    testFormGroup.setValue({ key: {} });
    
    expect(service.formValue).toEqual({ key: {} });
    expect(emittedValue).toEqual({ key: {} });
  });

  it('should update component and global state via internal service', () => {
    service.setInternalService(mockInternalService);
    const updateComponentSpy = jest.spyOn(mockInternalService, 'updateComponentState');
    const updateGlobalSpy = jest.spyOn(mockInternalService, 'updateGlobalState');

    service.updateComponentState('myKey', { visible: true });
    service.updateGlobalState({ theme: 'dark' });

    expect(updateComponentSpy).toHaveBeenCalledWith('myKey', { visible: true });
    expect(updateGlobalSpy).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('should set isSubmitted on internal service if set', () => {
    service.setIsSubmitted(true); // Should return immediately without crash

    service.setInternalService(mockInternalService);
    const setIsSubmittedSpy = jest.spyOn(mockInternalService, 'setIsSubmitted');
    service.setIsSubmitted(true);
    expect(setIsSubmittedSpy).toHaveBeenCalledWith(true);
  });

  it('should patch value of formGroup', () => {
    const testFormGroup = new UntypedFormGroup({});
    service.setInternalService(mockInternalService);
    mockInternalService.formGroup$.next(testFormGroup);

    const patchValueSpy = jest.spyOn(testFormGroup, 'patchValue');
    service.patchValue({ test: 123 });
    expect(patchValueSpy).toHaveBeenCalledWith({ test: 123 });
  });

  describe('setFormConfig', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set configuration immediately if internal service is set', () => {
      service.setInternalService(mockInternalService);
      const setFormDataSpy = jest.spyOn(mockInternalService, 'setFormData');

      const mockConfig: any = { root: {} };
      service.setFormConfig(mockConfig);

      expect(setFormDataSpy).toHaveBeenCalledWith(mockConfig);
    });

    it('should apply a config set before the internal service connects once it connects', () => {
      const mockConfig: any = { root: {} };
      const setFormDataSpy = jest.spyOn(mockInternalService, 'setFormData');
      service.setFormConfig(mockConfig);
      expect(setFormDataSpy).not.toHaveBeenCalled();

      service.setInternalService(mockInternalService);

      expect(setFormDataSpy).toHaveBeenCalledWith(mockConfig);
    });

    it('should apply only the latest config set before the internal service connects', () => {
      const first: any = { root: { a: 1 } };
      const second: any = { root: { b: 2 } };
      const setFormDataSpy = jest.spyOn(mockInternalService, 'setFormData');
      service.setFormConfig(first);
      service.setFormConfig(second);
      service.setInternalService(mockInternalService);

      expect(setFormDataSpy).toHaveBeenCalledTimes(1);
      expect(setFormDataSpy).toHaveBeenCalledWith(second);
    });

    it('should log an error if no form connects within half a second', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      service.setFormConfig({ root: {} } as any);

      jest.advanceTimersByTime(500);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal form service is unavailable.  Is the ngs-form root tag added to the page?');
      consoleErrorSpy.mockRestore();
    });

    it('should not log an error after the service is destroyed', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      service.setFormConfig({ root: {} } as any);
      service.ngOnDestroy();

      jest.advanceTimersByTime(1000);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
