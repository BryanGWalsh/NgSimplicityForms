import { Directive, Signal } from '@angular/core';
import { NgsFormsBaseClassFormInputComponent } from './form-component-input.class';
import { NgsFormsFormInputOption, NgsFormsFormItemConfigBaseInputWithOptions } from '../../models';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

/**
 * Base class for inputs with options. Exposes `options` as a signal that follows `options$` when given and falls
 * back to the static `options`.
 */
@Directive()
export class NgsFormsBaseClassFormItemInputWithOptionsComponent<T extends NgsFormsFormItemConfigBaseInputWithOptions> extends NgsFormsBaseClassFormInputComponent<T> {
  /** The current options. */
  options: Signal<Array<NgsFormsFormInputOption>> = toSignal(
    this.config.options$ ?? of(this.config.options ?? []),
    { initialValue: this.config.options ?? [] }
  );
}

