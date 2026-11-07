import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemChipsComponent`. */
export interface NgsFormsFormItemConfigMaterialChips extends NgsFormsFormItemConfigBaseInput {
  /** Placeholder text of the text input that adds chips. */
  placeholder?: string;
  /**
   * Allow the same text more than once.
   * @defaultValue false
   */
  allowDuplicates?: boolean;
}

/**
 * Angular Material chips input (`mat-chip-grid`): the user types a value and presses Enter or comma to add it as
 * a chip. The value is an array of strings.
 *
 * @remarks Registry key: `chips`. `Validators.required` rejects an empty array; use `Validators.maxLength(n)` to
 * limit the number of chips.
 */
@Component({
  selector: 'ngs-forms-mat-chips',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatChipsModule],
  templateUrl: './chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemChipsComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialChips> {
  static override key = 'chips';
  chipsConfig = this.config as NgsFormsFormItemConfigMaterialChips;
  /** Keys that turn the typed text into a chip. */
  readonly separatorKeys = [ENTER, COMMA] as const;
  /** Error state matcher that also shows errors after the form is submitted. */
  matcher = {
    isErrorState: (control: AbstractControl | null): boolean => {
      return !!(control && control.invalid && (control.touched || control.dirty || this.submitted()));
    },
  };

  /** The chips, from the control's value. */
  values(): string[] {
    const value = this.control?.value;
    return Array.isArray(value) ? value : [];
  }

  /** Adds the typed text as a chip. */
  add(event: MatChipInputEvent) {
    const text = (event.value || '').trim();
    const current = this.values();
    if (text && (this.chipsConfig.allowDuplicates || !current.includes(text))) {
      this.update([...current, text]);
    }
    event.chipInput.clear();
  }

  /** Removes the chip at `index`. */
  remove(index: number) {
    const next = [...this.values()];
    next.splice(index, 1);
    this.update(next);
  }

  private update(next: string[]) {
    const control = this.control;
    if (!control) return;
    control.markAsDirty();
    control.setValue(next);
  }

  /** Creates a `chips` item. */
  static create(config: NgsFormsFormItemConfigMaterialChips): NgsFormsFormItem<NgsFormsFormItemConfigMaterialChips> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemChipsComponent.key,
      config,
    };
  }
}
