import { BehaviorSubject, filter, map } from 'rxjs';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { NgsFormsFormConfig } from '../../models';
import { Injectable } from '@angular/core';
import { NgsFormsGlobalFormState } from '../../models/global-state.interface';
import { ngsDefaults } from '../../misc/defaults';

/**
 * Per form state holder that connects `<ngs-form>`, its items and `NgsFormsService`.
 *
 * @remarks Provided by `NgsFormComponent`. Application code should use `NgsFormsService` instead; this service is
 * exported for authors of custom components and may change between minor versions.
 */
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
    const state: { [key: string]: any } = { ...(formConfig.initialState ?? {}) };
    state['global'] = { ...(formConfig.globalState ?? {}) };
    this.state.next(state);
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
  /** Sets a component's state from its config's `initialState`, unless state for `uuid` already exists. */
  seedComponentState(uuid: string, initialState: any) {
    if (!uuid || !initialState || this.state.value[uuid]) return;
    this.mergeState(uuid, initialState);
  }
  updateGlobalState(state: NgsFormsGlobalFormState) {
    this.mergeState('global', state);
  }
  updateComponentState(componentKey: string, state: any) {
    this.mergeState(componentKey, state);
  }

  /**
   * Merged state for one component: its own (by `uuid`), then by `name`, then global.
   * `initialState` seeds the component's own state unless state for `uuid` already exists.
   */
  subscribeToState(uuid: string, name?: string, initialState?: any) {
    this.seedComponentState(uuid, initialState);
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
