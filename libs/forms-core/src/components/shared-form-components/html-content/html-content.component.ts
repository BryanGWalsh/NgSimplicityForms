import { Component, ChangeDetectionStrategy, inject, Sanitizer, SecurityContext } from '@angular/core';
import { NgsFormsBaseClassFormComponent } from '../../../classes/form-component-base/form-component.class';
import { NgsFormItemHtmlContentConfig } from './html-content-config.model';
import { NgsFormsFormItem } from '../../../models';
import { v4 } from 'uuid';

@Component({
  selector: 'ngs-form-component-html-content',
  imports: [],
  templateUrl: './html-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsHtmlContentComponent extends NgsFormsBaseClassFormComponent<NgsFormItemHtmlContentConfig> {
  static override key = 'content-html';
  contentConfig = this.config as NgsFormItemHtmlContentConfig;
  html: string;

  constructor() {
    super();
    const sanitizer = inject(Sanitizer);
    this.html =
      sanitizer.sanitize(SecurityContext.HTML, this.contentConfig.html) ||
      '';
  }

  static create(
    config: NgsFormItemHtmlContentConfig
  ): NgsFormsFormItem<NgsFormItemHtmlContentConfig> {
    return {
      uuid: v4(),
      type: NgsFormsHtmlContentComponent.key,
      config,
    };
  }
}
