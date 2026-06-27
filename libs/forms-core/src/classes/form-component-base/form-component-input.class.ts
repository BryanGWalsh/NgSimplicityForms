import { NgsFormsCommonComponentState, NgsFormsFormItemConfigBaseInput } from '../../models';
import { Directive, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { NgsFormsFormItemWithVisibleAndValidatorsBase } from './form-component-item-with-visible-and-validators-base.class';
import { NgsFormsInternalService, NgsFormsService } from '../../services';

@Directive({}) // for compiler
export abstract class NgsFormsBaseClassFormInputComponent<T extends NgsFormsFormItemConfigBaseInput> extends NgsFormsFormItemWithVisibleAndValidatorsBase<T> {
  readonly myFormService = inject(NgsFormsService);
  private readonly internalService = inject(NgsFormsInternalService);

  readonly commonState: Signal<NgsFormsCommonComponentState> = toSignal(
    this.internalService.subscribeToState(this.itemData.uuid || '', this.config.name),
    { initialValue: {} as NgsFormsCommonComponentState }
  );

  toggleDisplayMode(setTo: 'summary' | 'input'){

  }
}

