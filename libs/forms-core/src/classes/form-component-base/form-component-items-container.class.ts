import { NgsFormsFormItemContainerConfigBase } from '../../models';

import { NgsFormsBaseClassFormComponent } from './form-component.class';
import { Directive, OnDestroy } from '@angular/core';

/** Base class for container items that render `config.items` without owning a form control. */
@Directive({}) // no op for compiler
export class NgsFormsBaseClassItemsContainerBase<T extends NgsFormsFormItemContainerConfigBase> extends NgsFormsBaseClassFormComponent<T> implements OnDestroy {}
