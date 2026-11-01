// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { NgsFormsFormErrorKeyValueMap } from '../errors';
import { Observable } from 'rxjs';
import { ValidatorFn } from '@angular/forms';
import { NgsFormsFormInputOption } from './form-item-option.model';
import { NgsFormsFormItem } from '../form-config';

/** Base configuration shared by every form item (inputs, containers and content items). */
export interface NgsFormsFormItemConfigBase {
  /**
   * Stable identifier for the item. Generated with `uuid` by the `create()` factories when omitted.
   * Component state set with `NgsFormsService.updateComponentState()` can be keyed by this value.
   */
  uuid?: string;
  /**
   * Static visibility flag.
   *
   * @notImplemented
   * @remarks Reserved for future use: the renderer currently ignores it. Use `visible$` to show or hide an item.
   */
  visible?: boolean;
  /**
   * Stream that controls whether the item is rendered.
   *
   * @remarks When the stream emits `false` the item's component is destroyed and its control is removed from the
   * parent form group, so hidden fields are excluded from the form value and from validation. When it emits `true`
   * the component is created again with a fresh control. Items without `visible$` are always rendered.
   * @example
   * ```ts
   * visible$: this.forms.formValue$.pipe(map((v) => v?.profile?.contactMethod === 'email'))
   * ```
   */
  visible$?: Observable<boolean>;
  /**
   * Initial component state for this item.
   *
   * @notImplemented
   * @remarks Reserved for future use.
   */
  initialState?: any;
}

/**
 * Configuration for items that render a list of child items without creating a form control of their own
 * (for example sections and columns).
 */
export interface NgsFormsFormItemContainerConfigBase extends NgsFormsFormItemConfigBase {
  /** The child items to render, in order. */
  items: Array<NgsFormsFormItem<any>>
}

/**
 * Configuration for `NgsFormsFormGroupComponent`: a named group of child items backed by an `UntypedFormGroup`.
 */
export interface NgsFormsFormGroupConfig extends NgsFormsFormItemConfigBaseItemWithNameAndValidators, NgsFormsFormItemContainerConfigBase {}

/** Base configuration for items that own a form control (inputs, groups and arrays). */
export interface NgsFormsFormItemConfigBaseItemWithNameAndValidators extends NgsFormsFormItemConfigBase{
  /**
   * Control name inside the parent form group. Becomes the key of this item's value in `NgsFormsService.formValue$`.
   */
  name: string;
  /**
   * Maps validator error keys (for example `required`, `minlength`, `email`) to the message shown to the user.
   *
   * @remarks Only the first error on the control is displayed. Errors without an entry fall back to
   * `Field is invalid: <errorKey>`. Messages appear once the control is touched or dirty, or after
   * `NgsFormsService.setIsSubmitted(true)`.
   */
  errorMessageMap?: NgsFormsFormErrorKeyValueMap;
  /**
   * Static disabled flag.
   *
   * @notImplemented
   * @remarks Reserved for future use: the built-in components do not read it yet.
   */
  disabled?: boolean;
  /**
   * Stream that controls the disabled state.
   *
   * @notImplemented
   * @remarks Reserved for future use: the built-in components do not read it yet.
   */
  disabled$?: Observable<boolean>;
  /**
   * Angular validators applied to the item's control. Takes precedence over `validators$` when both are set.
   */
  validators?: Array<ValidatorFn>;
  /**
   * Stream of validator arrays. Each emission replaces the control's validators, which lets rules depend on other
   * values in the form. Ignored when `validators` is also set.
   *
   * @remarks The control's validity is recalculated on its next value change, so call `updateValueAndValidity()`
   * yourself if you need the new rules to apply immediately.
   */
  validators$? :Observable<Array<ValidatorFn>>;
}

// ---

/** Base configuration for a labelled input control. */
export interface NgsFormsFormItemConfigBaseInput extends NgsFormsFormItemConfigBaseItemWithNameAndValidators {
  /**
   * Optional element id.
   *
   * @notImplemented
   * @remarks Reserved for future use: the built-in components generate their own ids.
   */
  id?: string;
  /** Label text shown next to or above the control. */
  label: string;
  /**
   * Initial value.
   *
   * @notImplemented
   * @remarks Reserved for future use. Set initial values with `NgsFormsService.patchValue()` after the form renders.
   */
  value?: unknown;
}

// ---

/** Base configuration for single line text inputs. */
export interface NgsFormsFormItemConfigBaseTextInput extends NgsFormsFormItemConfigBaseInput {
  /** Placeholder text shown while the input is empty. */
  placeholder?: string;
  /**
   * The HTML input type.
   * @defaultValue 'text'
   */
  type?: 'text' | 'email' | 'password'
}


/**
 * Base configuration for inputs that choose from a list of options (radio groups and selects).
 */
export interface NgsFormsFormItemConfigBaseInputWithOptions  extends NgsFormsFormItemConfigBaseInput {
  /** Static list of options. Used as the initial value when `options$` is also set. */
  options?: Array<NgsFormsFormInputOption>;
  /**
   * Stream of options. Each emission replaces the rendered options, which makes cascading selects and
   * server-loaded option lists possible.
   */
  options$?: Observable<Array<NgsFormsFormInputOption>>;
}
// --
