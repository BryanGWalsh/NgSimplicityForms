import { afterNextRender, Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Injector, OnInit } from '@angular/core';
import { NgsFormsFormArrayInternalService } from '../service';
import { AbstractControl, FormArray, UntypedFormGroup } from '@angular/forms';

import { v4 } from 'uuid';
import { NgsFormsFormArrayListConfig } from './form-array-list.config';
import { NgsFormsFormItemDirective } from '../../../core';
import { NgsFormsBaseClassFormComponent } from '../../../../classes/form-component-base/form-component.class';
import { NgsFormsFormItem } from '../../../../models';

/**
 * Renders one copy of `templateItem` for every row of the enclosing form array. Each row gets its own form group,
 * so the controls in the template become the properties of each array entry.
 *
 * @remarks Registry key: `form-array-list`. Must be placed inside an `NgsFormsFormArrayContainerComponent`.
 */
@Component({
  selector: 'ngs-forms-form-array-list',
  templateUrl: './form-array-list.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayListComponent extends NgsFormsBaseClassFormComponent<NgsFormsFormArrayListConfig> implements OnInit {
  static override key = 'form-array-list';
  public internalArrayService = inject<NgsFormsFormArrayInternalService>(
    NgsFormsFormArrayInternalService
  );
  public myFormArray: FormArray<any> = this.internalArrayService.formArray;
  private changeDetectorRef = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);

  ngOnInit() {
    this.subscribe(this.internalArrayService.itemsChanged, () => {
      this.changeDetectorRef.markForCheck();
    });
    this.subscribe(this.internalArrayService.rowRemoved, (index) => this.restoreFocusAfterRemove(index));
  }

  /**
   * When the focused element (usually the row's Remove button) was removed with its row, moves focus to the
   * same kind of control in the row that took its place, so keyboard users are not sent back to the top of the page.
   */
  private restoreFocusAfterRemove(index: number) {
    afterNextRender(
      () => {
        const active = document.activeElement;
        if (active && active !== document.body) {
          return;
        }
        const host = this.elementRef.nativeElement as HTMLElement;
        const rows = Array.from(host.querySelectorAll<HTMLElement>(':scope > [data-index]'));
        const row = rows[Math.min(index, rows.length - 1)];
        const focusable =
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
        const target =
          row?.querySelector<HTMLElement>('ngs-forms-form-array-remove-item button:not([disabled])') ??
          row?.querySelector<HTMLElement>(focusable) ??
          host.closest('ngs-forms-form-array')?.querySelector<HTMLElement>(focusable);
        target?.focus();
      },
      { injector: this.injector }
    );
  }

  /** Creates a `form-array-list` item. */
  static create(
    config: NgsFormsFormArrayListConfig
  ): NgsFormsFormItem<NgsFormsFormArrayListConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayListComponent.key,
      config: config,
    };
  }

  castToFormGroup(control: AbstractControl): UntypedFormGroup {
    return control as UntypedFormGroup;
  }
}
