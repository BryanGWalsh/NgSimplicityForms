import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { NgsFormItemRowConfig } from './form-row-config.model';
import { NgsFormsFormItem } from '../../../models';
import { v4 } from 'uuid';
import { NgsFormsFormItemDirective, NgsFormsBaseClassFormComponent } from '../../../internal';

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
  static create(config: NgsFormItemRowConfig): NgsFormsFormItem<NgsFormItemRowConfig> {
    return {
      uuid: v4(),
      type: NgsFormsRowComponent.key,
      config: config,
    };
  }
}
