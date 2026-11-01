import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgsFormsService } from '@ng-simplicity/forms-core';

/**
 * Docs helper used by the demos: shows the live form value and status of the
 * NgsFormsService provided by the demo component that hosts it.
 */
@Component({
  selector: 'docs-form-state-panel',
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-state-panel">
      <div class="docs-state-badges">
        <span class="badge" [class.text-bg-success]="status().valid" [class.text-bg-danger]="!status().valid">
          {{ status().valid ? 'valid' : 'invalid' }}
        </span>
        <span class="badge" [class.text-bg-warning]="status().dirty" [class.text-bg-secondary]="!status().dirty">
          {{ status().dirty ? 'dirty' : 'pristine' }}
        </span>
        @if (submitted()) {
          <span class="badge text-bg-info">submitted</span>
        }
      </div>
      <div class="docs-state-label">formValue$</div>
      <pre class="docs-state-json">{{ value() | json }}</pre>
    </div>
  `,
})
export class FormStatePanelComponent {
  readonly submitted = input(false);
  private readonly forms = inject(NgsFormsService);
  readonly value = toSignal(this.forms.formValue$);
  // isValid and dirty are plain getters, so re-read them whenever the value or submitted flag changes.
  readonly status = computed(() => {
    this.value();
    this.submitted();
    return { valid: this.forms.isValid, dirty: this.forms.dirty };
  });
}
