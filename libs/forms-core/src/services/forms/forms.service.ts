import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NgsFormsFormConfig } from '../../models';
import { NgsFormsInternalService } from '../internal/internal-forms.service';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class NgsFormsService implements OnDestroy {
  attempt = 0;
  formValue$ = new BehaviorSubject<any>({});
  formValue: any = {};
  private internalFormService: NgsFormsInternalService | undefined;
  private formGroupSubscriptions: Array<Subscription> = [];
  private formGroup = new UntypedFormGroup({});

  get dirty(): boolean {
    return this.formGroup?.dirty ?? false;
  }
  get isValid(): boolean {
    if (!this.internalServiceIsSet) return false;
    return this.internalFormService!.checkIsValid();
  }
  get internalServiceIsSet(): boolean {
    return !!this.internalFormService;
  }

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

  setInternalService(internalFormsService: NgsFormsInternalService): void {
    this.internalFormService = internalFormsService;
    this.bindFormGroup();
  }

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
  updateComponentState(componentKey: string, state: any): void {
    this.internalFormService?.updateComponentState(componentKey, state);
  }
  updateGlobalState(state: any): void {
    this.internalFormService?.updateGlobalState(state);
  }
  ngOnDestroy() {
    this.formGroupSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  patchValue(entityData: any) {
    this.formGroup.patchValue(entityData);
  }
}
