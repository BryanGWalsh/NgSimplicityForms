import { Injector, ViewContainerRef } from '@angular/core';

import { NgsFormsComponentRegistryService } from '../../services/form-component-registry/form-component-registry.service';

export interface NgsFormItemControllerOptions {
  viewContainerRef: ViewContainerRef;
  injector: Injector;
  formComponentRegistryService: NgsFormsComponentRegistryService;
}
