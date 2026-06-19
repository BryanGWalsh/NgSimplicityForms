import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgsFormsService } from '../../../services/forms/forms.service';
import { NgsFormsInternalService } from '../../../services/internal/internal-forms.service';
import { NgsFormsFormItemDirective } from '../form-item/form-item.component';

@Component({
  selector: 'ngs-form',
  templateUrl: './form.component.html',
  providers: [NgsFormsInternalService],
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormComponent {
  private readonly ngsInternalFormsService = inject(NgsFormsInternalService);
  readonly ngsFormsService = inject(NgsFormsService);

  readonly formGroup = toSignal(this.ngsInternalFormsService.formGroup$);
  readonly formConfig = toSignal(this.ngsInternalFormsService.formConfig$);

  constructor() {
    this.ngsFormsService.setInternalService(this.ngsInternalFormsService);
  }
}

