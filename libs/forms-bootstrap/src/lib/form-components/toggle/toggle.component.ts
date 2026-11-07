import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgsFormsBaseClassFormInputComponent, NgsFormsFormItem } from '@ng-simplicity/forms-core';
import { v4 } from 'uuid';
import { NgsFormsFormItemConfigBootstrapToggle } from './toggle.config';

/**
 * Bootstrap 5 toggle switch (`.form-switch`). Its value is `true` or `false` (or `null` before the first change).
 *
 * @remarks Registry key: `toggle`. Exposed to assistive technology as a switch.
 */
@Component({
  selector: 'ngs-forms-bs-toggle',
  imports: [ReactiveFormsModule],
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgsFormsBootstrapFormItemToggleComponent extends NgsFormsBaseClassFormInputComponent<NgsFormsFormItemConfigBootstrapToggle> {
  static override key = 'toggle';

  /** Creates a `toggle` item. */
  static create(config: NgsFormsFormItemConfigBootstrapToggle): NgsFormsFormItem<NgsFormsFormItemConfigBootstrapToggle> {
    return {
      uuid: config.uuid || v4(),
      type: NgsFormsBootstrapFormItemToggleComponent.key,
      config,
    };
  }
}
