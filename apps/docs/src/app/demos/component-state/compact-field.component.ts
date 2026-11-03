import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { v4 as uuid } from 'uuid';
import {
  NgsFormsBaseClassFormItemInputWithOptionsComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInputWithOptions,
} from '@ng-simplicity/forms-core';

/** A text input, or a select when `options` are given. */
export interface CompactFieldConfig extends NgsFormsFormItemConfigBaseInputWithOptions {
  placeholder?: string;
}

/**
 * A field with two display modes, read from `commonState()`:
 * - `summary`: one compact line with the current value, to save space on small screens.
 * - `input`: the editable control.
 * When `showEditToggle` is set, a button switches between them with `toggleDisplayMode()`.
 */
@Component({
  selector: 'docs-compact-field',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control) {
      @if (commonState().displayMode === 'summary') {
        <div class="docs-compact-row">
          <span class="text-body-secondary">{{ config.label }}</span>
          <span class="docs-compact-value" [class.text-danger]="!!errorMessage">{{ summary() || 'Not set' }}</span>
          @if (commonState().showEditToggle) {
            <button type="button" class="btn btn-link btn-sm p-0" [attr.aria-label]="'Edit ' + config.label"
                    (click)="toggleDisplayMode('input')">Edit</button>
          }
        </div>
      } @else {
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-baseline">
            <label class="form-label" [for]="id" [class.text-danger]="!!errorMessage">{{ config.label }}</label>
            @if (commonState().showEditToggle) {
              <button type="button" class="btn btn-link btn-sm p-0" (click)="toggleDisplayMode('summary')">Done</button>
            }
          </div>
          @if (options().length) {
            <select class="form-select" [id]="id" [formControl]="control">
              @for (option of options(); track option.id) {
                <option [value]="option.id">{{ option.label }}</option>
              }
            </select>
          } @else {
            <input class="form-control" [id]="id" [formControl]="control" [placeholder]="config.placeholder || ''" />
          }
          @if (errorMessage) {
            <div class="text-danger small mt-1">{{ errorMessage }}</div>
          }
        </div>
      }
    }
  `,
  styles: `
    .docs-compact-row { display: flex; gap: .75rem; align-items: baseline; padding: .5rem 0; border-bottom: 1px solid var(--bs-border-color); }
    .docs-compact-value { flex: 1; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `,
})
export class CompactFieldComponent extends NgsFormsBaseClassFormItemInputWithOptionsComponent<CompactFieldConfig> {
  static override key = 'compact-field';

  static create(config: CompactFieldConfig): NgsFormsFormItem<CompactFieldConfig> {
    return { uuid: config.uuid || uuid(), type: CompactFieldComponent.key, config };
  }

  private readonly value = toSignal(this.myFormService.formValue$.pipe(startWith(null)));

  /** The text shown in summary mode: the option label for selects, the raw value otherwise. */
  readonly summary = computed(() => {
    this.value();
    const current = this.control?.value;
    const option = this.options().find((o) => o.id === current);
    return option ? option.label : (current ?? '');
  });
}
