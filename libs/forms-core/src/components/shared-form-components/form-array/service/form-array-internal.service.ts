import { inject, Injectable, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NgsFormItemArrayConfig } from '../container';
import { NGS_FORMS_ITEM_DATA } from '../../../../misc';
import { NgsFormsFormItem } from '../../../../models/index';
import { Subject } from 'rxjs';
import { NgsFormsInternalService } from '../../../../services/internal/internal-forms.service';

/**
 * Holds the `UntypedFormArray` of one `NgsFormsFormArrayContainerComponent` and is shared with its list and buttons.
 *
 * @remarks Inject it in a custom component placed inside a form array to add or remove rows programmatically.
 */
@Injectable()
export class NgsFormsFormArrayInternalService implements OnDestroy {
  config = inject<NgsFormsFormItem<NgsFormItemArrayConfig>>(NGS_FORMS_ITEM_DATA).config;

  readonly formArray = new UntypedFormArray([]);
  private readonly formsInternalService = inject(NgsFormsInternalService, { optional: true });
  /** Emits after a row is added or removed. */
  readonly itemsChanged = new Subject<void>();
  /** Emits the index of a row right after it is removed. */
  readonly rowRemoved = new Subject<number>();

  constructor() {
    if (this.config.initialItemCount) {
      for (let i = 0; i < this.config.initialItemCount; i++) {
        this.addItem();
      }
    }
  }

  ngOnDestroy() {
    this.itemsChanged.complete();
    this.rowRemoved.complete();
  }

  /** Removes the row at `index`, unless that would go below `minItems`. */
  removeAt(index: number) {
    if (this.config?.minItems && this.formArray.controls.length <= this.config!.minItems!) {
      return;
    }
    if (index < 0 || index >= this.formArray.controls.length) {
      return;
    }
    // Server errors for rows are matched by index, so they are cleared once the rows move.
    this.formsInternalService?.serverErrors?.clear();
    this.formArray.removeAt(index);
    this.rowRemoved.next(index);
    this.itemsChanged.next();
  }
  /** Appends an empty row, unless the array already has `maxItems` rows. */
  addItem() {
    if (this.config?.maxItems && this.formArray.controls.length >= this.config!.maxItems) {
      return;
    }
    this.formsInternalService?.serverErrors?.clear();
    this.formArray.push(new UntypedFormGroup({}));
    this.itemsChanged.next();
  }
}
