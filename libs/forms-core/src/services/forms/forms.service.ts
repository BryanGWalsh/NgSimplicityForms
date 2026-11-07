import { AbstractControl, FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { NgsFormsCommonComponentState, NgsFormsFormConfig, NgsFormsGlobalFormState } from '../../models';
import { NgsFormsServerErrors } from '../../misc/server-errors';
import { NgsFormsInternalService } from '../internal/internal-forms.service';
import { Injectable, OnDestroy } from '@angular/core';

/**
 * The public API of a form. Provide it on the component that hosts `<ngs-form>` so each form gets its own instance.
 *
 * @example
 * ```ts
 * @Component({
 *   selector: 'app-profile',
 *   imports: [NgsFormComponent],
 *   providers: [NgsFormsService],
 *   template: `<ngs-form />`,
 * })
 * export class ProfileComponent {
 *   private readonly forms = inject(NgsFormsService);
 *   readonly value = toSignal(this.forms.formValue$);
 * }
 * ```
 */
@Injectable()
export class NgsFormsService implements OnDestroy {
  /**
   * Emits the root form group's value every time it changes. Combine with `toSignal()` to read it in a template.
   *
   * @remarks The value is keyed by the root group's `name`, for example `{ profile: { firstName: 'Ada' } }`.
   */
  formValue$ = new BehaviorSubject<any>({});
  /** The latest value emitted by `formValue$`. */
  formValue: any = {};
  private internalFormService: NgsFormsInternalService | undefined;
  private formGroupBinding: Subscription | undefined;
  private formGroup = new UntypedFormGroup({});
  /** The config from the latest `setFormConfig()` call, re-applied when `<ngs-form>` (re)connects. */
  private lastConfig: NgsFormsFormConfig | undefined;
  private missingFormTimer: ReturnType<typeof setTimeout> | undefined;
  private destroyed = false;
  /** Patches still being applied while the form renders, in call order. */
  private pendingPatches: Array<{ [key: string]: any }> = [];
  private patchTimer: ReturnType<typeof setTimeout> | undefined;
  /** The controls that existed when the pending patches were last applied. */
  private patchedStructure: string | undefined;
  private patchRounds = 0;
  /** Render passes in a row in which no control was added or removed. */
  private stablePatchRounds = 0;

  /** `true` once the user has changed any control in the form. */
  get dirty(): boolean {
    return this.formGroup?.dirty ?? false;
  }
  /** `true` when every rendered control passes its validators. Hidden items are not validated. */
  get isValid(): boolean {
    if (!this.internalServiceIsSet) return false;
    return this.internalFormService!.checkIsValid();
  }
  /** `true` once `<ngs-form>` has connected to this service. */
  get internalServiceIsSet(): boolean {
    return !!this.internalFormService;
  }

  /**
   * Renders a form from `formConfig`, replacing any form that is already shown and resetting the submitted state.
   *
   * @remarks It is safe to call before `<ngs-form>` has initialised (for example in `ngOnInit`): the latest config
   * is kept and applied as soon as the form component connects, and also when it is destroyed and created again
   * (inside an `@if` or a tab, for example). An error is logged if no form has connected after half a second.
   */
  setFormConfig(formConfig: NgsFormsFormConfig): void {
    this.lastConfig = formConfig;
    // Patches made for the previous form do not carry over. Patches made after this call are kept until it renders.
    this.cancelPendingPatches();
    if (this.internalServiceIsSet) {
      this.internalFormService!.setFormData(formConfig);
      return;
    }
    if (this.missingFormTimer === undefined && !this.destroyed) {
      this.missingFormTimer = setTimeout(() => {
        this.missingFormTimer = undefined;
        if (!this.internalServiceIsSet && !this.destroyed) {
          console.error('Internal form service is unavailable.  Is the ngs-form root tag added to the page?');
        }
      }, 500);
    }
  }

  /**
   * @internal
   */
  setInternalService(internalFormsService: NgsFormsInternalService): void {
    this.formGroupBinding?.unsubscribe();
    this.internalFormService = internalFormsService;
    this.bindFormGroup();
    if (this.lastConfig) {
      internalFormsService.setFormData(this.lastConfig);
    }
    if (this.pendingPatches.length) {
      this.schedulePatchRound();
    }
  }

  /**
   * @internal
   * Disconnects `internalFormsService` when its `<ngs-form>` is destroyed. Does nothing if another form has
   * connected since.
   */
  clearInternalService(internalFormsService: NgsFormsInternalService): void {
    if (this.internalFormService !== internalFormsService) return;
    this.formGroupBinding?.unsubscribe();
    this.formGroupBinding = undefined;
    this.internalFormService = undefined;
    this.formGroup = new UntypedFormGroup({});
  }

  /**
   * Marks the form as submitted (or not). While submitted, every invalid control shows its error message even if
   * the user never touched it.
   */
  setIsSubmitted(isSubmitted: boolean): void {
    if (!this.internalServiceIsSet) return;
    this.internalFormService!.setIsSubmitted(isSubmitted);
  }

  private bindFormGroup(): void {
    this.formGroupBinding = this.internalFormService!.formGroup$
      .pipe(
        switchMap((fg) => {
          this.formGroup = fg;
          return fg.valueChanges;
        })
      )
      .subscribe((v) => {
        this.formValue = v;
        this.formValue$.next(v);
      });
  }
  /**
   * Merges `state` into the state of one component, identified by its `uuid` or control `name`.
   * Components read the merged result through `commonState`.
   */
  updateComponentState(componentKey: string, state: Partial<NgsFormsCommonComponentState>): void {
    this.internalFormService?.updateComponentState(componentKey, state);
  }
  /** Merges `state` into the state shared by every component in the form. */
  updateGlobalState(state: Partial<NgsFormsGlobalFormState>): void {
    this.internalFormService?.updateGlobalState(state);
  }
  ngOnDestroy() {
    this.destroyed = true;
    clearTimeout(this.missingFormTimer);
    this.missingFormTimer = undefined;
    this.cancelPendingPatches();
    this.formGroupBinding?.unsubscribe();
    this.formValue$.complete();
  }

  /**
   * Shows errors from the server on the matching controls, replacing any server errors shown before.
   *
   * @param errors - An object shaped like the form value (including the root group name) whose leaves are error
   * keys, for example `{ registration: { userName: 'taken', contacts: [{}, {}, { phone: 'invalid' }] } }`. Each key
   * is looked up in that control's `errorMessageMap`; when it has no entry the key itself is shown, so the server
   * can also send the message text. Use `constructServerErrorMessageObject()` to build it from a list of paths.
   * @returns The paths that matched no rendered control (a hidden item or a missing array row, for example), so you
   * can show those errors elsewhere.
   *
   * @remarks The controls are marked as touched so the messages show at once, and they stay invalid until their
   * value changes. All server errors are cleared by the next call, by `clearServerErrorMessages()`, by
   * `setFormConfig()`, and when rows are added to or removed from a form array, because rows are matched by index.
   */
  setServerErrorMessages(errors: NgsFormsServerErrors): string[] {
    if (!this.internalFormService) {
      console.error('setServerErrorMessages() was called before <ngs-form> connected.');
      return [];
    }
    return this.internalFormService.serverErrors.set(this.formGroup, errors);
  }

  /** Removes every error set with `setServerErrorMessages()`. */
  clearServerErrorMessages(): void {
    this.internalFormService?.serverErrors.clear();
  }

  /**
   * Patches values into the form, using the same shape as `formValue$` (including the root group name).
   *
   * @remarks It is safe to call straight after `setFormConfig()`, or before `<ngs-form>` has connected. The values
   * are applied at once to the controls that exist, kept, and applied again each time new controls appear, until
   * the form stops changing. That covers items that render later and items behind `visible$` that the patched values
   * themselves reveal (and anything those reveal in turn). Later calls are applied after earlier ones. A form array
   * only receives values for rows it has, so give it enough rows with `initialItemCount`. `setFormConfig()` drops
   * patches that are still being applied to the previous form.
   */
  patchValue(entityData: any) {
    this.pendingPatches.push(entityData);
    this.applyPendingPatches();
    this.patchRounds = 0;
    this.stablePatchRounds = 0;
    this.schedulePatchRound();
  }

  /** Maximum number of render passes a patch waits for new controls before it is dropped. */
  private static readonly MAX_PATCH_ROUNDS = 20;

  private applyPendingPatches() {
    for (const patch of this.pendingPatches) {
      this.formGroup.patchValue(patch);
    }
    this.patchedStructure = this.internalServiceIsSet ? controlStructure(this.formGroup) : undefined;
  }

  /**
   * Waits one render pass, then re-applies the pending patches if controls were added or removed. Stops once two
   * passes in a row change nothing (rendering can take a pass to start), or after `MAX_PATCH_ROUNDS` passes. Waits
   * without counting while no form is connected.
   */
  private schedulePatchRound() {
    clearTimeout(this.patchTimer);
    if (this.destroyed || !this.pendingPatches.length) return;
    if (!this.internalServiceIsSet) {
      // `setInternalService()` starts the rounds once <ngs-form> connects.
      this.patchTimer = undefined;
      return;
    }
    this.patchTimer = setTimeout(() => {
      this.patchTimer = undefined;
      if (this.destroyed || !this.internalServiceIsSet) return;
      const structure = controlStructure(this.formGroup);
      if (structure === this.patchedStructure) {
        if (++this.stablePatchRounds >= 2) {
          this.cancelPendingPatches();
          return;
        }
        this.schedulePatchRound();
        return;
      }
      this.stablePatchRounds = 0;
      this.applyPendingPatches();
      if (++this.patchRounds >= NgsFormsService.MAX_PATCH_ROUNDS) {
        this.cancelPendingPatches();
        return;
      }
      this.schedulePatchRound();
    });
  }

  private cancelPendingPatches() {
    clearTimeout(this.patchTimer);
    this.patchTimer = undefined;
    this.pendingPatches = [];
    this.patchedStructure = undefined;
    this.patchRounds = 0;
    this.stablePatchRounds = 0;
  }
}

/** A string listing the paths of every control under `control`, so a change in the form's controls can be seen. */
function controlStructure(control: AbstractControl, path = ''): string {
  if (control instanceof FormGroup) {
    return Object.keys(control.controls)
      .map((name) => controlStructure(control.controls[name], `${path}.${name}`))
      .join('|') + `|${path}{}`;
  }
  if (control instanceof FormArray) {
    return control.controls.map((row, i) => controlStructure(row, `${path}[${i}]`)).join('|') + `|${path}[]`;
  }
  return path;
}
