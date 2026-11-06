import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../../classes/form-component-base/form-component.class';
import { NgsFormsFormItem } from '../../../../models';
import { NgsFormItemArrayRemoveItemConfig } from './form-array-remove-item-config.model';
import { NgsFormsFormArrayInternalService } from '../service';
import { NGS_FORMS_ARRAY_ROW, NGS_FORMS_ITEM_INDEX } from '../../../../misc';
import { v4 } from 'uuid';

/**
 * A button that removes its own row from the enclosing form array, down to `minItems`.
 *
 * @remarks Registry key: `form-array-remove-item`. Place it inside the `templateItem` of an
 * `NgsFormsFormArrayListComponent` so each row gets one.
 */
@Component({
  selector: 'ngs-forms-form-array-remove-item',
  templateUrl: './form-array-remove-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsFormArrayRemoveItemComponent extends NgsFormsBaseClassFormComponent<NgsFormItemArrayRemoveItemConfig> implements OnInit {
  static override key = 'form-array-remove-item';
  internalArrayService = inject(NgsFormsFormArrayInternalService);
  private elementRef = inject(ElementRef);
  private indexFromDi = inject<number>(NGS_FORMS_ITEM_INDEX, { optional: true });
  private row = inject(NGS_FORMS_ARRAY_ROW, { optional: true });
  private changeDetectorRef = inject(ChangeDetectorRef);

  /** Accessible name of the button, from `ariaLabel` or `${buttonText} item ${index + 1}`. */
  get ariaLabel(): string {
    const index = this.myIndex;
    const label = this.config.ariaLabel;
    if (typeof label === 'function') return label(index);
    if (label) return label;
    return `${this.config.buttonText || 'Remove'} item ${index + 1}`;
  }

  /** Current index of the row this button belongs to. */
  get myIndex(): number {
    if (this.row) {
      const index = this.internalArrayService.formArray.controls.indexOf(this.row);
      if (index >= 0) {
        return index;
      }
    }
    if (this.indexFromDi !== null && this.indexFromDi !== undefined) {
      return this.indexFromDi;
    }
    const el = this.elementRef.nativeElement as HTMLElement;
    const container = el.closest('[data-index]');
    if (container) {
      const idxAttr = container.getAttribute('data-index');
      if (idxAttr !== null) {
        return parseInt(idxAttr, 10);
      }
    }
    return 0;
  }

  constructor() {
    super();
  }

  ngOnInit() {
    // The row's position changes when earlier rows are removed, which changes the default accessible name.
    this.subscribe(this.internalArrayService.itemsChanged, () => this.changeDetectorRef.markForCheck());
  }

  /** Creates a `form-array-remove-item` item. */
  static create(config: NgsFormItemArrayRemoveItemConfig): NgsFormsFormItem<NgsFormItemArrayRemoveItemConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsFormArrayRemoveItemComponent.key,
      config,
    };
  }

  removeItem() {
    this.internalArrayService.removeAt(this.myIndex);
  }
}
