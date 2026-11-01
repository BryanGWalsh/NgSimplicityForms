import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import {
  NgsFormsBaseClassFormInputComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInput,
} from '@ng-simplicity/forms-core';

/** 1. The configuration: everything an input has (name, label, validators…) plus our own options. */
export interface RatingConfig extends NgsFormsFormItemConfigBaseInput {
  max?: number;
  hint?: string;
}

/**
 * 2. The component. Extending NgsFormsBaseClassFormInputComponent gives us `config`, a `control` that is
 * already registered with the parent form group, validator binding, `errorMessage` and `commonState`.
 */
@Component({
  selector: 'docs-rating-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control) {
      <div class="mb-3">
        <div class="form-label" [id]="id + '-label'" [class.text-danger]="!!errorMessage">{{ config.label }}</div>
        @if (commonState().displayMode === 'summary') {
          <!-- Read-only rendering, switched on with NgsFormsService.updateGlobalState() -->
          <div>{{ control.value ? control.value + ' / ' + max() : 'Not rated' }}</div>
        } @else {
          <div class="docs-rating" role="radiogroup" [attr.aria-labelledby]="id + '-label'">
            @for (star of stars(); track star) {
              <button
                type="button"
                role="radio"
                class="docs-rating-star"
                [class.on]="star <= (control.value ?? 0)"
                [attr.aria-checked]="control.value === star"
                [attr.aria-label]="star + ' of ' + max()"
                (click)="rate(star)">
                <i class="bi" [class.bi-star-fill]="star <= (control.value ?? 0)" [class.bi-star]="star > (control.value ?? 0)" aria-hidden="true"></i>
              </button>
            }
          </div>
          @if (config.hint) {
            <div class="form-text">{{ config.hint }}</div>
          }
        }
        @if (errorMessage) {
          <div class="text-danger small mt-1">{{ errorMessage }}</div>
        }
      </div>
    }
  `,
  styles: `
    .docs-rating { display: flex; gap: 2px; }
    .docs-rating-star { border: 0; background: none; padding: 0 2px; font-size: 1.5rem; color: #484f58; line-height: 1; }
    .docs-rating-star.on { color: #f59e0b; }
    .docs-rating-star:focus-visible { outline: 2px solid #6366f1; border-radius: 4px; }
  `,
})
export class RatingInputComponent extends NgsFormsBaseClassFormInputComponent<RatingConfig> implements OnInit {
  /** 3. The registry key that form items use in their `type`. */
  static override key = 'rating';

  /** 4. A typed factory, like the built-in components have. */
  static create(config: RatingConfig): NgsFormsFormItem<RatingConfig> {
    return { uuid: config.uuid || uuid(), type: RatingInputComponent.key, config };
  }

  readonly max = computed(() => this.config.max ?? 5);
  readonly stars = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  override ngOnInit() {
    super.ngOnInit();
    // The base class sets validators without re-running them. Built-in inputs get that for free from the
    // [formControl] directive; a control that doesn't bind [formControl] must do it itself.
    this.control!.updateValueAndValidity();
  }

  rate(value: number) {
    this.control!.setValue(value);
    this.control!.markAsDirty();
    this.control!.markAsTouched();
  }
}
