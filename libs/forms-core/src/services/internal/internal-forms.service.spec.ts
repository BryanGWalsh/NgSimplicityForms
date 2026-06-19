import { TestBed } from '@angular/core/testing';
import { NgsFormsInternalService } from './internal-forms.service';
import { NgsFormsFormConfig } from '../../models';
import { UntypedFormGroup } from '@angular/forms';
import { take } from 'rxjs';

describe('NgsFormsInternalService', () => {
  let service: NgsFormsInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgsFormsInternalService]
    });
    service = TestBed.inject(NgsFormsInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set form data, reset formGroup, and reset submitted state', (done) => {
    service.setIsSubmitted(true);
    
    const mockConfig: NgsFormsFormConfig = {
      inputUpdateDebounce: 100,
      globalState: {},
      root: {
        uuid: '1',
        type: 'form-group',
        config: { name: 'testForm' }
      }
    };
    
    service.setFormData(mockConfig);

    service.isSubmitted$.subscribe((isSubmitted) => {
      expect(isSubmitted).toBe(false);
    });

    service.formConfig$.subscribe((config) => {
      expect(config).toEqual(mockConfig);
      done();
    });
  });

  it('should update global state and component state correctly', (done) => {
    service.updateGlobalState({ displayMode: 'summary', showEditToggle: true });
    service.updateComponentState('myInput', { visible: true });

    service.state.subscribe((state) => {
      expect(state['global']).toEqual({ displayMode: 'summary', showEditToggle: true });
      expect(state['myInput']).toEqual({ visible: true });
      done();
    });
  });

  it('should merge global and component state when subscribing to component state', (done) => {
    service.updateGlobalState({ showEditToggle: false });
    service.updateComponentState('myInput', { showEditToggle: true });

    service.subscribeToState('myInput').pipe(take(1)).subscribe((mergedState) => {
      expect(mergedState).toEqual({
        showEditToggle: true // Component overrides global
      });
      done();
    });
  });

  describe('checkIsValid', () => {
    it('should return false if formGroup is null/undefined', () => {
      service.formGroup$.next(null as any);
      expect(service.checkIsValid()).toBe(false);
    });

    it('should return valid status of the formGroup', () => {
      const mockFormGroup = new UntypedFormGroup({});
      service.formGroup$.next(mockFormGroup);

      // Empty form group is valid by default
      expect(service.checkIsValid()).toBe(true);

      // Force invalid state by setting an invalid validator or status
      const invalidFormGroup = { valid: false } as any;
      service.formGroup$.next(invalidFormGroup);
      expect(service.checkIsValid()).toBe(false);
    });
  });
});
