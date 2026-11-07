import { InjectionToken, Provider } from '@angular/core';

/**
 * The Tailwind utility classes used by every part of the Tailwind components. Each property is a space separated
 * class list. Override any of them with `provideNgsFormsTailwindClasses()`.
 *
 * @remarks Properties ending in `Valid` and `Invalid` are swapped depending on whether the control is showing an
 * error, so keep colours there and layout in the base property. Tailwind only generates classes it can find in your
 * sources: when you override a class, write the full class name in your code (not built from pieces).
 */
export interface NgsFormsTailwindClasses {
  /** Wrapper of a field whose label sits above the control. */
  field: string;
  /** Wrapper of a field whose label sits to the left (`labelLocation: 'left'`). From the `sm` breakpoint up it is a 12 column grid. */
  fieldHorizontal: string;
  /** Label above a control. */
  label: string;
  /** Label to the left of a control. */
  labelHorizontal: string;
  /** Label colour while the control is valid. Also used for checkbox and radio option labels. */
  labelValid: string;
  /** Label colour while the control shows an error. */
  labelInvalid: string;
  /** Wrapper around the control and its error in the horizontal layout. */
  controlWrapperHorizontal: string;
  /** Text input, select and textarea. */
  control: string;
  /** Border and focus ring of a valid text input, select or textarea. */
  controlValid: string;
  /** Border and focus ring of a text input, select or textarea that shows an error. */
  controlInvalid: string;
  /** Added to the textarea on top of `control`. */
  textarea: string;
  /** Wrapper of a checkbox. */
  checkboxField: string;
  /** Row holding a checkbox or radio button and its label. */
  choice: string;
  /** Checkbox and radio inputs. */
  choiceInput: string;
  /** Added to checkbox and radio inputs while the control shows an error. */
  choiceInputInvalid: string;
  /** Label next to a checkbox or radio button. */
  choiceLabel: string;
  /** Wrapper (`role="radiogroup"`) of a radio group. */
  radioGroup: string;
  /** Holds the group label and options of a vertical radio group. */
  radioOptions: string;
  /** Holds the group label and options of a horizontal radio group (`alignment: 'horizontal'`). */
  radioOptionsHorizontal: string;
  /** Label of a radio group. */
  radioGroupLabel: string;
  /** Validation message under a control. */
  error: string;
  /** Row holding a toggle switch's hidden input, its track and its label. */
  toggleLabel: string;
  /** The visually hidden checkbox or radio inside a toggle switch or a button group button. */
  toggleInput: string;
  /** The drawn track and knob of a toggle switch. Style the checked state with `peer-checked:`. */
  toggleTrack: string;
  /** Added to the toggle track while the control shows an error. */
  toggleTrackInvalid: string;
  /** Wrapper of the buttons of a button group. */
  buttonGroup: string;
  /** One button of a button group. Style the chosen state with `has-[:checked]:`. */
  buttonGroupButton: string;
  /** Added to every button of a button group while the control shows an error. */
  buttonGroupButtonInvalid: string;
  /** Row holding a range slider's label and current value. */
  rangeHeader: string;
  /** The range slider's current value. */
  rangeValue: string;
  /** The range input. */
  range: string;
}

/** The classes the Tailwind components use unless you override them. */
export const NGS_FORMS_TAILWIND_DEFAULT_CLASSES: NgsFormsTailwindClasses = {
  field: 'mb-4',
  fieldHorizontal: 'mb-4 sm:grid sm:grid-cols-12 sm:items-start sm:gap-x-4',
  label: 'block mb-1 text-sm font-medium',
  labelHorizontal: 'block mb-1 text-sm font-medium sm:col-span-2 sm:mb-0 sm:pt-[9px]',
  labelValid: 'text-gray-700 dark:text-gray-200',
  labelInvalid: 'text-red-600 dark:text-red-400',
  controlWrapperHorizontal: 'sm:col-span-10',
  // Arbitrary values (border-[1px], bg-[white]) avoid Bootstrap's !important utilities of the same name, for apps that load both.
  control:
    'block w-full rounded-md border-[1px] border-solid bg-[white] px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 ' +
    'focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ' +
    'dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:disabled:bg-gray-800',
  controlValid: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/40 dark:border-gray-600',
  controlInvalid: 'border-red-500 focus:border-red-500 focus:ring-red-500/40 dark:border-red-400',
  textarea: 'h-52',
  checkboxField: 'mb-4',
  choice: 'flex items-center gap-2',
  choiceInput: 'h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed',
  choiceInputInvalid: 'outline outline-1 outline-offset-2 outline-red-500',
  choiceLabel: 'text-sm',
  radioGroup: 'mb-4',
  radioOptions: 'flex flex-col gap-2',
  radioOptionsHorizontal: 'flex flex-wrap items-center gap-x-6 gap-y-2',
  radioGroupLabel: 'text-sm font-medium',
  error: 'mt-1 text-sm text-red-600 dark:text-red-400',
  toggleLabel: 'relative inline-flex items-center gap-3',
  toggleInput: 'peer sr-only',
  toggleTrack:
    "relative inline-block h-6 w-11 shrink-0 cursor-pointer rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] " +
    'peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 ' +
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:bg-gray-600',
  toggleTrackInvalid: 'ring-2 ring-red-500',
  buttonGroup: 'inline-flex flex-wrap rounded-md shadow-sm',
  buttonGroupButton:
    'relative -ml-px cursor-pointer border-[1px] border-solid border-gray-300 bg-[white] px-4 py-2 text-sm font-medium text-gray-700 first:ml-0 first:rounded-l-md last:rounded-r-md hover:bg-gray-50 ' +
    'has-[:checked]:z-10 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-600 has-[:checked]:text-white has-[:focus-visible]:z-10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500/40 ' +
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200',
  buttonGroupButtonInvalid: 'border-red-500 dark:border-red-400',
  rangeHeader: 'flex items-baseline justify-between',
  rangeValue: 'text-sm text-gray-500 dark:text-gray-400',
  range: 'block w-full cursor-pointer accent-blue-600 disabled:cursor-not-allowed',
};

/**
 * The classes the Tailwind components read. Defaults to `NGS_FORMS_TAILWIND_DEFAULT_CLASSES`; provide it with
 * `provideNgsFormsTailwindClasses()`.
 */
export const NGS_FORMS_TAILWIND_CLASSES = new InjectionToken<NgsFormsTailwindClasses>('NGS_FORMS_TAILWIND_CLASSES', {
  providedIn: 'root',
  factory: () => NGS_FORMS_TAILWIND_DEFAULT_CLASSES,
});

/**
 * Replaces some of the Tailwind classes used by the components. Properties you leave out keep their defaults.
 * Add it to your application providers to restyle every form, or to a component's `providers` to restyle the forms
 * inside it.
 *
 * @example
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNgsFormsTailwindClasses({
 *       controlValid: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/40',
 *       choiceInput: 'h-4 w-4 cursor-pointer accent-emerald-600',
 *     }),
 *   ],
 * });
 * ```
 */
export function provideNgsFormsTailwindClasses(classes: Partial<NgsFormsTailwindClasses>): Provider {
  return {
    provide: NGS_FORMS_TAILWIND_CLASSES,
    useValue: { ...NGS_FORMS_TAILWIND_DEFAULT_CLASSES, ...classes },
  };
}
