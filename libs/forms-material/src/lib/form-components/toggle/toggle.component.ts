import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem, NgsFormsFormItemConfigBaseInput } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';

/** Configuration for `NgsFormsMaterialFormItemToggleComponent`. */
export type NgsFormsFormItemConfigMaterialToggle = NgsFormsFormItemConfigBaseInput;

/**
 * Angular Material slide toggle (`mat-slide-toggle`). Its value is `true` or `false` (or `null` before the first
 * change).
 *
 * @remarks Registry key: `toggle`.
 */
@Component({
  selector: 'ngs-forms-mat-toggle',
  imports: [ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsMaterialFormItemToggleComponent
  extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigMaterialToggle>
  implements AfterViewChecked
{
  static override key = 'toggle';
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  /**
   * Id of the `mat-slide-toggle`. Material builds CSS selectors from it, so a generated id (which can start with a
   * digit) gets a prefix.
   */
  readonly toggleId = this.config.id || `ngs-toggle-${this.id}`;

  /** `mat-slide-toggle` has no `aria-invalid` input, so it is set on its switch while an error is shown. */
  ngAfterViewChecked(): void {
    const button = this.elementRef.nativeElement.querySelector('[role=switch]');
    if (!button) return;
    if (this.errorMessage) {
      button.setAttribute('aria-invalid', 'true');
    } else {
      button.removeAttribute('aria-invalid');
    }
  }

  /** Creates a `toggle` item. */
  static create(config: NgsFormsFormItemConfigMaterialToggle): NgsFormsFormItem<NgsFormsFormItemConfigMaterialToggle> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsMaterialFormItemToggleComponent.key,
      config,
    };
  }
}
