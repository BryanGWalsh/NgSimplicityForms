import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsInternalService } from '../../../services/internal/internal-forms.service';
import { NgsFormsFormItemDirective } from '../form-item/form-item.component';

/**
 * Renders the form described by the `NgsFormsFormConfig` given to the nearest `NgsFormsService`.
 *
 * @remarks Place it in the template of the component that provides `NgsFormsService`. It takes no inputs.
 * @example
 * ```html
 * <ngs-form></ngs-form>
 * ```
 */
@Component({
  selector: 'ngs-form',
  templateUrl: './form.component.html',
  providers: [NgsFormsInternalService],
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormComponent implements OnDestroy {
  private readonly ngsInternalFormsService = inject(NgsFormsInternalService);
  readonly ngsFormsService = inject(NgsFormsService);

  readonly formGroup = toSignal(this.ngsInternalFormsService.formGroup$);
  readonly formConfig = toSignal(this.ngsInternalFormsService.formConfig$);

  /** The root item to render with the form group it belongs to (empty until a config is set). */
  readonly rendered = computed(() => {
    const group = this.formGroup();
    const root = this.formConfig()?.root;
    return group && root ? [{ group, root }] : [];
  });

  constructor() {
    this.ngsFormsService.setInternalService(this.ngsInternalFormsService);
  }

  ngOnDestroy(): void {
    this.ngsFormsService.clearInternalService(this.ngsInternalFormsService);
  }
}

