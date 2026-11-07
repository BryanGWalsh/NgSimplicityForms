import { BehaviorSubject, defer, distinctUntilChanged, map, Observable } from 'rxjs';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { NgsFormsCommonComponentState, NgsFormsFormConfig } from '../../models';
import { Injectable } from '@angular/core';
import { NgsFormsGlobalFormState } from '../../models/global-state.interface';
import { ngsDefaults } from '../../misc/defaults';
import { NgsFormsServerErrorRegistry } from '../../misc/server-errors';

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
  /** Server errors set with `NgsFormsService.setServerErrorMessages()`. */
  readonly serverErrors = new NgsFormsServerErrorRegistry();
  setIsSubmitted(isSubmitted: boolean): void {
    this.isSubmitted$.next(isSubmitted);
  }

  /** `true` when no rendered control fails its validators. A form whose controls are all disabled counts as valid. */
  checkIsValid(): boolean {
    const formGroup = this.formGroup$.value;
    if (!formGroup) return false;
    return formGroup.valid || formGroup.disabled === true;
  }

  setFormData(formConfig: NgsFormsFormConfig) {
    const state: { [key: string]: any } = { ...(formConfig.initialState ?? {}) };
    state['global'] = { ...(formConfig.globalState ?? {}) };
    this.state.next(state);
    this.serverErrors.reset();
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
  updateGlobalState(state: Partial<NgsFormsGlobalFormState>) {
    this.mergeState('global', state);
  }
  updateComponentState(componentKey: string, state: Partial<NgsFormsCommonComponentState>) {
    this.mergeState(componentKey, state);
  }

  /**
   * Merged state for one component: its own (by `uuid`), then by `name`, then global.
   * `initialState` seeds the component's own state unless state for `uuid` already exists.
   */
  subscribeToState(uuid: string, name?: string, initialState?: any): Observable<NgsFormsCommonComponentState> {
    this.seedComponentState(uuid, initialState);
    // `defer` gives every subscriber its own comparison, so each one receives the current state first.
    return defer(() =>
      this.state.pipe(
        map((allState) => {
          const stateByUuid = allState[uuid] || {};
          const stateByName = name ? (allState[name] || {}) : {};
          const globalState = allState['global'] || {};
          return ngsDefaults(stateByUuid, ngsDefaults(stateByName, globalState)) as NgsFormsCommonComponentState;
        }),
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
      )
    );
  }
}
