import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormItemRowConfig } from './form-row-config.model';
import { NgsFormsFormItem } from '../../../models';
import { v4 } from 'uuid';
import { NgsFormsFormItemDirective } from '../../core';
import { NgsFormsBaseClassFormComponent } from '../../../classes/form-component-base/form-component.class';

/**
 * Lays out items side by side. Each item is wrapped in a div whose class comes from `columnClass` (same for every
 * item) or `columnClasses` (one per item), so it works with any CSS grid system.
 *
 * @remarks Registry key: `form-row`. Does not create a form control.
 * @example
 * ```ts
 * NgsFormsRowComponent.create({
 *   containerClass: 'row g-3',
 *   columnClasses: ['col-md-6', 'col-md-6'],
 *   items: [firstName, lastName],
 * })
 * ```
 */
@Component({
  selector: 'ngs-forms-row-component',
  templateUrl: './form-row.component.html',
  imports: [NgsFormsFormItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NgsFormsRowComponent extends NgsFormsBaseClassFormComponent<NgsFormItemRowConfig> {
  static override key = 'form-row';
  constructor(
  ) {
    super();
  }
  getIndividualRowDivClass(index: number) {
    if (this.config.columnClass) {
      return this.config.columnClass;
    }
    if (!this.config.columnClasses?.length) {
      return '';
    }
    return this.config.columnClasses[index];
  }
  /** Creates a `form-row` item. */
  static create(config: NgsFormItemRowConfig): NgsFormsFormItem<NgsFormItemRowConfig> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsRowComponent.key,
      config: config,
    };
  }
}
