import { Directive, inject, OnDestroy, OnInit, Signal, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { INgsFormsFormControlAddRemove, NGS_FORMS_CONTROL_ADD_REMOVE_FN } from '../../misc';
import { NgsFormsInternalService } from '../../services';
import { NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../models/item-config-bases/';
import { NgsFormsBaseClassFormComponent } from './form-component.class';
import { merge, Observable, of } from 'rxjs';

/**
 * Base class for items that own a form control. Creates the control (seeded with `value` when the config has one),
 * applies `validators` / `validators$` and `disabled` / `disabled$`, registers it with the parent group under
 * `config.name` and keeps `errorMessage` up to date.
 *
 * @typeParam T - The item's config type.
 * @typeParam C - The type of `control`. Inputs use the default `UntypedFormControl`; groups and arrays set it in
 * their constructor to an `UntypedFormGroup` or `UntypedFormArray`.
 */
@Directive({})
export class NgsFormsFormItemWithVisibleAndValidatorsBase<
    T extends NgsFormsFormItemConfigBaseItemWithNameAndValidators,
    C extends AbstractControl = UntypedFormControl,
  >
  extends NgsFormsBaseClassFormComponent<T>
  implements OnInit, OnDestroy
{
  /** The item's form control. Bind it with `[formControl]`. */
  control: C | undefined;
  /**
   * Message for the control's first error, taken from `errorMessageMap`. Empty while the control is valid, or
   * before it is touched, dirty or submitted.
   */
  errorMessage = '';
  private formAddRemoveFns = inject<INgsFormsFormControlAddRemove>(NGS_FORMS_CONTROL_ADD_REMOVE_FN);
  private privateService = inject<NgsFormsInternalService>(NgsFormsInternalService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  /** Whether the form has been marked as submitted with `NgsFormsService.setIsSubmitted()`. */
  readonly submitted: Signal<boolean> = toSignal(this.privateService.isSubmitted$, { initialValue: false });
  /** The latest value of `disabled` / `disabled$`, or `undefined` when the config sets neither. */
  private disabledFromConfig: boolean | undefined;

  ngOnInit() {
    if (!this.control) {
      const initialValue = (this.config as { value?: unknown }).value;
      this.control = new FormControl(initialValue, { validators: [] }) as unknown as C;
    }
    const control = this.control;
    this.bindValidators();
    this.formAddRemoveFns.add(control, this.config.name);
    this.bindDisabled();

    // Recompute the error message on value, status and touched changes, and when the form is submitted.
    // `control.events` (Angular 18+) includes touched changes, so blurring an untouched field shows its error.
    // Angular 17 has no `events`, so there the message updates on value and status changes only.
    const controlEvents$: Observable<unknown> =
      (control as { events?: Observable<unknown> }).events ?? merge(control.valueChanges, control.statusChanges);
    this.subscribe(
      merge(controlEvents$, this.privateService.isSubmitted$),
      () => {
        this.updateErrorMessage();
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  /** Whether the control currently has `Validators.required` or `Validators.requiredTrue`. */
  get isRequired(): boolean {
    const control = this.control;
    return !!control && (control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue));
  }

  private updateErrorMessage() {
    if (!this.control) {
      this.errorMessage = '';
      return;
    }
    const showErrors = this.control.invalid && (this.control.touched || this.control.dirty || this.submitted());
    if (!showErrors) {
      this.errorMessage = '';
      return;
    }
    const errors = this.control.errors;
    if (!errors) {
      this.errorMessage = '';
      return;
    }
    const firstErrorKey = Object.keys(errors)[0];
    const map = this.config.errorMessageMap;
    this.errorMessage = map?.[firstErrorKey] || `Field is invalid: ${firstErrorKey}`;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.formAddRemoveFns.remove(this.control!, this.config.name);
  }

  private bindValidators() {
    if (!this.config.validators && !this.config.validators$) return;
    const control = this.control!;
    if (this.config.validators) {
      control.setValidators(this.config.validators);
      // A group or array computed its status when it was created, before these validators were set.
      control.updateValueAndValidity({ emitEvent: false });
      return;
    }
    if (this.config.validators$) {
      this.subscribe(this.config.validators$!, (validators: Array<ValidatorFn>) => {
        control.setValidators(validators);
        control.updateValueAndValidity();
      });
    }
  }

  private bindDisabled() {
    const disabled$ = this.config.disabled$ ?? (this.config.disabled !== undefined ? of(this.config.disabled) : undefined);
    if (!disabled$) return;
    const control: AbstractControl = this.control!;
    this.subscribe(disabled$, (disabled: boolean) => {
      this.disabledFromConfig = !!disabled;
      this.applyDisabled(control);
    });
    const reapply = () => {
      if (this.disabledFromConfig && control.enabled) {
        control.disable();
      }
    };
    // Child controls are added to groups and arrays after the container has been disabled, and adding an enabled
    // child re-enables its parent. Re-apply the configured state whenever a container's status changes.
    if (control instanceof FormGroup || control instanceof FormArray) {
      this.subscribe(control.statusChanges, reapply);
    }
    // Enabling a parent group or array enables every child in it. The parent emits its status after its children
    // are enabled, so re-apply the configured state then. (Doing it on the child's own status change would be undone
    // by the end of the child's `enable()`, which re-enables the bound DOM element.)
    if (control.parent) {
      this.subscribe(control.parent.statusChanges, reapply);
    }
  }

  private applyDisabled(control: AbstractControl) {
    if (this.disabledFromConfig && !control.disabled) {
      control.disable();
    } else if (!this.disabledFromConfig && control.disabled) {
      control.enable();
    }
    this.changeDetectorRef.markForCheck();
  }
}

