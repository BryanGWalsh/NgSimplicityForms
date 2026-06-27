import { BehaviorSubject, filter, map } from 'rxjs';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { NgsFormsFormConfig } from '../../models';
import { Injectable } from '@angular/core';
import { NgsFormsGlobalFormState } from '../../models/global-state.interface';
import { ngsDefaults } from '../../misc/defaults';

@Injectable()
export class NgsFormsInternalService {
  formGroup$ = new BehaviorSubject<FormGroup>(new UntypedFormGroup({}));
  formConfig$ = new BehaviorSubject<NgsFormsFormConfig | undefined>(undefined);
  isSubmitted$ = new BehaviorSubject<boolean>(false);
  state = new BehaviorSubject<{ [key: string]: any }>({});
  setIsSubmitted(isSubmitted: boolean): void {
    this.isSubmitted$.next(isSubmitted);
  }

  checkIsValid(): boolean {
    if (!this.formGroup$.value) return false;
    return this.formGroup$.value.valid;
  }

  setFormData(formConfig: NgsFormsFormConfig) {
    this.formGroup$.next(new UntypedFormGroup({}));
    this.formConfig$.next(formConfig);
    this.isSubmitted$.next(false);
  }
  private mergeState(key: string, update: any): void {
    const obj = this.state.value[key] || {};
    const updated = ngsDefaults(update, obj);
    this.state.value[key] = updated;
    this.state.next(this.state.value);
  }
  updateGlobalState(state: NgsFormsGlobalFormState) {
    this.mergeState('global', state);
  }
  updateComponentState(componentKey: string, state: any) {
    this.mergeState(componentKey, state);
  }

  subscribeToState(uuid: string, name?: string) {
    let last = '';
    return this.state.pipe(
      map((allState) => {
        const stateByUuid = allState[uuid] || {};
        const stateByName = name ? (allState[name] || {}) : {};
        const globalState = allState['global'] || {};
        return ngsDefaults(stateByUuid, ngsDefaults(stateByName, globalState));
      }),
      filter((currentState) => {
        const stringifiedState = JSON.stringify(currentState);
        const isUpdated = stringifiedState !== last;
        last = stringifiedState;
        return isUpdated;
      })
    );
  }
}
