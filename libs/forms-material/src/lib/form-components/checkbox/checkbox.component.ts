import { AfterViewChecked, Component, ChangeDetectionStrategy, ElementRef, inject } from '@angular/core';
import {
  NgsFormsBaseClassFormInputComponent,
  NgsFormsFormItem,
  NgsFormsFormItemConfigBaseInput,
} from '@ng-simplicity/forms-core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { v4 } from 'uuid';

/**
 * Angular Material checkbox (`mat-checkbox`).
 *
 * @remarks Registry key: `checkbox`.
 */
@Component({
  selector: 'ngs-forms-mat-checkbox',
  imports: [ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemCheckboxComponent
  extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBaseInput>
  implements AfterViewChecked
{
  static override key = 'checkbox';
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /** `mat-checkbox` has no `aria-invalid` input, so it is set on its native input while an error is shown. */
  ngAfterViewChecked(): void {
    const input = this.elementRef.nativeElement.querySelector('input[type=checkbox]');
    if (!input) return;
    if (this.errorMessage) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  /** Creates a `checkbox` item. */
  static create(config: NgsFormsFormItemConfigBaseInput): NgsFormsFormItem<NgsFormsFormItemConfigBaseInput> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemCheckboxComponent.key,
      config,
    };
  }
}
