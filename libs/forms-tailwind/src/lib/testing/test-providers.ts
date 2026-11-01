import { Provider } from '@angular/core';
import { NGS_FORMS_ITEM_DATA, NGS_FORMS_CONTROL_ADD_REMOVE_FN, NgsFormsInternalService, NgsFormsService } from '@ng-simplicity/forms-core';
import { BehaviorSubject, of } from 'rxjs';

/** Providers that let a Tailwind component render on its own in a TestBed. Test only. */
export function tailwindTestProviders(config: object) {
  const submitted$ = new BehaviorSubject(false);
  const addRemove = { add: jest.fn(), remove: jest.fn() };
  const providers: Provider[] = [
    { provide: NGS_FORMS_ITEM_DATA, useValue: { config } },
    { provide: NGS_FORMS_CONTROL_ADD_REMOVE_FN, useValue: addRemove },
    { provide: NgsFormsInternalService, useValue: { isSubmitted$: submitted$, subscribeToState: jest.fn().mockReturnValue(of({})) } },
    { provide: NgsFormsService, useValue: {} },
  ];
  return { providers, submitted$, addRemove };
}

/** Whether an element has every class of a space separated class list (Angular sorts `[class]` bindings). */
export function hasClasses(el: Element, classList: string): boolean {
  return classList.split(/\s+/).filter(Boolean).every((c) => el.classList.contains(c));
}
