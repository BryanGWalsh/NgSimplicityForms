import { Directive, inject, OnDestroy, OnInit, Signal, ChangeDetectorRef } from '@angular/core';
import { FormControl, UntypedFormControl, ValidatorFn } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { INgsFormsFormControlAddRemove, NGS_FORMS_CONTROL_ADD_REMOVE_FN } from '../../misc';
import { NgsFormsInternalService } from '../../services';
import { NgsFormsFormItemConfigBaseItemWithNameAndValidators } from '../../models/item-config-bases/';
import { NgsFormsBaseClassFormComponent } from '../../classes/index';
import { merge } from 'rxjs';

@Directive({})
export class NgsFormsFormItemWithVisibleAndValidatorsBase<T extends NgsFormsFormItemConfigBaseItemWithNameAndValidators> extends NgsFormsBaseClassFormComponent<T> implements OnInit, OnDestroy {
  control: UntypedFormControl | undefined;
  errorMessage = '';
  private formAddRemoveFns = inject<INgsFormsFormControlAddRemove>(NGS_FORMS_CONTROL_ADD_REMOVE_FN);
  private privateService = inject<NgsFormsInternalService>(NgsFormsInternalService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  readonly submitted: Signal<boolean> = toSignal(this.privateService.isSubmitted$, { initialValue: false });

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl(undefined, { validators: [] });
    }
    //this.bindVisible();
    this.bindValidators();
    //this.bindControlValidityChange();
    this.formAddRemoveFns.add(this.control, this.config.name);

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

  /*
  private bindVisible() {
    this.subscribe(this.parentVisibility$, (isVisible) => {
      if (this.isVisible === isVisible) return;
      this.isVisible = isVisible;
      if (isVisible) {
        this.formGroup.addControl(this.config.name, this.control);
        return;
      }
      this.formGroup.removeControl(this.config.name);
    });
  }
  */
}

