import { Directive, inject, OnDestroy, OnInit, Signal, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormControl, ValidatorFn } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { INgsFormsFormControlAddRemove, NGS_FORMS_CONTROL_ADD_REMOVE_FN } from '../../misc';
import { NgsFormsInternalService } from '../../services';
import { NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../models/item-config-bases/';
import { NgsFormsBaseClassFormComponent } from './form-component.class';
import { merge, of } from 'rxjs';

/**
 * Base class for items that own a form control. Creates the control (seeded with `value` when the config has one),
 * applies `validators` / `validators$` and `disabled` / `disabled$`, registers it with the parent group under
 * `config.name` and keeps `errorMessage` up to date.
 */
@Directive({})
export class NgsFormsFormItemWithVisibleAndValidatorsBase<T extends NgsFormsFormItemConfigBaseItemWithNameAndValidators> extends NgsFormsBaseClassFormComponent<T> implements OnInit, OnDestroy {
  /** The item's form control. Bind it with `[formControl]`. */
  control: UntypedFormControl | undefined;
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
      this.control = new FormControl(initialValue, { validators: [] });
    }
    this.bindValidators();
    this.formAddRemoveFns.add(this.control, this.config.name);
    this.bindDisabled();

    // Listen to changes and update error message dynamically
    this.subscribe(
      merge(
        this.control.valueChanges,
        this.control.statusChanges,
        this.privateService.isSubmitted$
      ),
      () => {
        this.updateErrorMessage();
        this.changeDetectorRef.markForCheck();
      }
    );
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
    if (this.config.validators) {
      this.control!.setValidators(this.config.validators);
      return;
    }
    if (this.config.validators$) {
      this.subscribe(this.config.validators$!, (validators: Array<ValidatorFn>) => this.control!.setValidators(validators));
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
    // Child controls are added to groups and arrays after the container has been disabled, and adding an enabled
    // child re-enables its parent. Re-apply the configured state whenever a container's status changes.
    if (control instanceof FormGroup || control instanceof FormArray) {
      this.subscribe(control.statusChanges, () => {
        if (this.disabledFromConfig && control.enabled) {
          control.disable();
        }
      });
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

