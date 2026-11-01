import { Injectable, Type } from '@angular/core';

/**
 * Maps registry keys (the `type` of an `NgsFormsFormItem`) to the Angular components that render them.
 *
 * @remarks The service is provided in the `platform` injector, so there is one registry per page. Registering a
 * key again replaces the previous component, which is how a theme package or your own component can override a
 * built-in one. Register components before the form renders, typically in the constructor of the component that
 * hosts `<ngs-form>`.
 * @example
 * ```ts
 * constructor(registry: NgsFormsComponentRegistryService) {
 *   NgsFormsBootstrapModule.registerAllBootStrapComponents(registry);
 *   registry.register(MyRatingComponent.key, MyRatingComponent);
 * }
 * ```
 */
@Injectable({ providedIn: 'platform' })
export class NgsFormsComponentRegistryService {
  private readonly itemComponentRegistry: TItemComponentRegistry = {};
  /** Returns the component registered for `key`, or `undefined` when nothing is registered. */
  getComponentTypeForKey(key: string): Type<unknown> | undefined {
    return this.itemComponentRegistry[key];
  }
  /** Registers `component` under `key`, replacing any component already registered for it. */
  register(key: string, component: Type<unknown>): void {
    this.itemComponentRegistry[key] = component;
  }
}

type TItemComponentRegistry = { [key: string]: Type<unknown> };
