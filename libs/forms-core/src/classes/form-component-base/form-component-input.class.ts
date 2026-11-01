import { NgsFormsCommonComponentState, NgsFormsFormItemConfigBaseInput } from '../../models';
import { Directive, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { NgsFormsFormItemWithVisibleAndValidatorsBase } from './form-component-item-with-visible-and-validators-base.class';
import { NgsFormsInternalService, NgsFormsService } from '../../services';

/**
 * Base class for input components. Adds access to the form's `NgsFormsService` and the merged component state.
 *
 * @remarks This is the class to extend when you build your own input. See the Custom components guide.
 */
@Directive({}) // for compiler
export abstract class NgsFormsBaseClassFormInputComponent<T extends NgsFormsFormItemConfigBaseInput> extends NgsFormsFormItemWithVisibleAndValidatorsBase<T> {
  /** The `NgsFormsService` of the form this input belongs to. */
  readonly myFormService = inject(NgsFormsService);
  private readonly internalService = inject(NgsFormsInternalService);

  /** Merged state for this component: its own state, then state by name, then global state. */
  readonly commonState: Signal<NgsFormsCommonComponentState> = toSignal(
    this.internalService.subscribeToState(this.itemData.uuid || '', this.config.name),
    { initialValue: {} as NgsFormsCommonComponentState }
  );

  /**
   * Switches between input and summary display.
   *
   * @notImplemented
   */
  toggleDisplayMode(setTo: 'summary' | 'input'){

  }
}

