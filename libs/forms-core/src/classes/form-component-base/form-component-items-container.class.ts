import { NgsFormsFormItemContainerConfigBase } from '../../models';

import { NgsFormsBaseClassFormComponent } from './form-component.class';
import { Directive, OnDestroy } from '@angular/core';

@Directive({}) // no op for compiler
export class NgsFormsBaseClassItemsContainerBase<T extends NgsFormsFormItemContainerConfigBase> extends NgsFormsBaseClassFormComponent<T> implements OnDestroy {}
