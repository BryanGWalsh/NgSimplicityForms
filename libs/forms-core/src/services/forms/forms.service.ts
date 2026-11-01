import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NgsFormsFormConfig } from '../../models';
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
   * @internal
   */
  attempt = 0;
  /**
   * Emits the root form group's value every time it changes. Combine with `toSignal()` to read it in a template.
   *
   * @remarks The value is keyed by the root group's `name`, for example `{ profile: { firstName: 'Ada' } }`.
   */
  formValue$ = new BehaviorSubject<any>({});
  /** The latest value emitted by `formValue$`. */
  formValue: any = {};
  private internalFormService: NgsFormsInternalService | undefined;
  private formGroupSubscriptions: Array<Subscription> = [];
  private formGroup = new UntypedFormGroup({});

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
   * @remarks It is safe to call before `<ngs-form>` has initialised (for example in `ngOnInit`): the call is retried
   * every 25 ms for about half a second until the form component is available.
   */
  setFormConfig(formConfig: NgsFormsFormConfig): void {
    if (!this.internalServiceIsSet) {
      if (this.attempt > 20) {
        console.error('Internal form service is unavailable.  Is the ngs-form root tag added to the page?');
        return;
      }
      this.attempt++;
      setTimeout(() => this.setFormConfig(formConfig), 25);
      return;
    }
    this.internalFormService!.setFormData(formConfig);
  }

  /**
   * @internal
   */
  setInternalService(internalFormsService: NgsFormsInternalService): void {
    this.internalFormService = internalFormsService;
    this.bindFormGroup();
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
    this.internalFormService!.formGroup$.subscribe((fg) => {
      this.formGroup = fg;
      this.formGroupSubscriptions.forEach((subscription) => subscription.unsubscribe());

      this.formGroupSubscriptions.push(
        this.formGroup.valueChanges.subscribe((v) => {
          this.formValue = v;
          this.formValue$.next(v);
        })
      );
    });
  }
  /**
   * Merges `state` into the state of one component, identified by its `uuid` or control `name`.
   * Components read the merged result through `commonState`.
   */
  updateComponentState(componentKey: string, state: any): void {
    this.internalFormService?.updateComponentState(componentKey, state);
  }
  /** Merges `state` into the state shared by every component in the form. */
  updateGlobalState(state: any): void {
    this.internalFormService?.updateGlobalState(state);
  }
  ngOnDestroy() {
    this.formGroupSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Patches values into the form, using the same shape as `formValue$` (including the root group name).
   *
   * @remarks Only controls that are currently rendered receive values. Patch again after a conditional item becomes
   * visible, and make sure a form array has enough rows (see `initialItemCount`) before patching array values.
   */
  patchValue(entityData: any) {
    this.formGroup.patchValue(entityData);
  }
}
