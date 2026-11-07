import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Server errors for a form, in the same shape as the form value. Each leaf is the error key (or keys) to show on
 * that control. The key is looked up in the control's `errorMessageMap`, just like a client-side validator's key.
 *
 * @example
 * ```ts
 * // Root group `registration`, its `userName` field taken, and the third row of the `contacts` array rejected.
 * const errors: NgsFormsServerErrors = {
 *   registration: {
 *     userName: 'taken',
 *     contacts: [{}, {}, { phone: 'invalidPhone' }, {}],
 *   },
 * };
 * ```
 */
export type NgsFormsServerErrors = string | string[] | NgsFormsServerErrorGroup | NgsFormsServerErrorArray;
/** Server errors for the controls of a form group, keyed by control name. */
export interface NgsFormsServerErrorGroup {
  [controlName: string]: NgsFormsServerErrors | null | undefined;
}
/** Server errors for the rows of a form array, by row index. Use `{}` or `null` for a row without errors. */
export type NgsFormsServerErrorArray = Array<NgsFormsServerErrors | null | undefined>;

/** One server error: the path of the control and the error key to show on it. */
export interface NgsFormsServerErrorPath {
  /**
   * Path of the control in the form value, for example `registration.userName` or
   * `registration.contacts[2].phone`. A leading `$` or `$.` is ignored, and bracket keys such as `['user name']`
   * are allowed.
   */
  jsonPath: string;
  /** The error key, looked up in the control's `errorMessageMap`. */
  validator: string;
}

/**
 * Builds the object for `NgsFormsService.setServerErrorMessages()` from a flat list of paths and error keys, for
 * APIs that return their errors that way. Array indexes create arrays, and rows without errors are filled with `{}`.
 * Two errors on the same path become an array of keys.
 *
 * @example
 * ```ts
 * constructServerErrorMessageObject([
 *   { jsonPath: 'registration.userName', validator: 'taken' },
 *   { jsonPath: 'registration.contacts[2].phone', validator: 'invalidPhone' },
 * ]);
 * // { registration: { userName: 'taken', contacts: [{}, {}, { phone: 'invalidPhone' }] } }
 * ```
 */
export function constructServerErrorMessageObject(errors: ReadonlyArray<NgsFormsServerErrorPath>): NgsFormsServerErrorGroup {
  const result: NgsFormsServerErrorGroup = {};
  for (const { jsonPath, validator } of errors) {
    const segments = parseJsonPath(jsonPath);
    if (!segments.length || !validator) continue;
    let node: any = result;
    segments.forEach((segment, i) => {
      const isLast = i === segments.length - 1;
      if (Array.isArray(node) && typeof segment === 'number') {
        while (node.length < segment) node.push({});
      }
      if (isLast) {
        const existing = node[segment];
        if (typeof existing === 'string') {
          node[segment] = existing === validator ? existing : [existing, validator];
        } else if (Array.isArray(existing) && existing.every((e) => typeof e === 'string')) {
          if (!existing.includes(validator)) existing.push(validator);
        } else {
          node[segment] = validator;
        }
        return;
      }
      const nextIsIndex = typeof segments[i + 1] === 'number';
      const existing = node[segment];
      if (existing === undefined || existing === null || typeof existing !== 'object') {
        node[segment] = nextIsIndex ? [] : {};
      } else if (nextIsIndex && !Array.isArray(existing) && Object.keys(existing).length === 0) {
        // A `{}` placeholder for an array row that is itself an array.
        node[segment] = [];
      }
      node = node[segment];
    });
  }
  return result;
}

/** Splits `a.b[2]['c d']` into `['a', 'b', 2, 'c d']`. */
function parseJsonPath(jsonPath: string): Array<string | number> {
  const path = (jsonPath ?? '').trim().replace(/^\$\.?/, '');
  const segments: Array<string | number> = [];
  const pattern = /\[\s*(\d+)\s*\]|\[\s*(['"])(.*?)\2\s*\]|([^.[\]]+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(path)) !== null) {
    if (match[1] !== undefined) segments.push(Number(match[1]));
    else if (match[3] !== undefined) segments.push(match[3]);
    else if (match[4] !== undefined) segments.push(match[4]);
  }
  return segments;
}

/**
 * Marker on the error value of a server error (`control.errors[key][NGS_FORMS_SERVER_ERROR] === true`). When the
 * key has no entry in `errorMessageMap`, the key itself is shown as the message, so servers can send message text.
 */
export const NGS_FORMS_SERVER_ERROR = 'ngsServerError';

interface ServerErrorEntry {
  keys: string[];
  /** The value the control had when the server rejected it. The error goes away once the value changes. */
  value: unknown;
}

/**
 * Applies server errors to a form and clears each one when its control's value changes.
 *
 * @internal Used by `NgsFormsService`.
 */
export class NgsFormsServerErrorRegistry {
  private readonly entries = new Map<AbstractControl, ServerErrorEntry>();
  /**
   * Validator that reports a control's server errors. Form items include it whenever they set their validators,
   * so the errors survive re-validation until the control's value changes.
   */
  readonly validator: ValidatorFn = (control) => this.validate(control);

  /** `true` while at least one server error is set. */
  get hasErrors(): boolean {
    return this.entries.size > 0;
  }

  /** Replaces every server error with `errors`. Returns the paths that matched no control. */
  set(root: AbstractControl, errors: NgsFormsServerErrors | null | undefined): string[] {
    this.clear();
    const unmatched: string[] = [];
    this.apply(root, errors, '', unmatched);
    return unmatched;
  }

  /** Removes every server error. */
  clear(): void {
    if (!this.entries.size) return;
    const controls = Array.from(this.entries.keys());
    this.entries.clear();
    controls.forEach((control) => control.updateValueAndValidity());
  }

  /** Forgets every server error without re-validating, for when the controls are being thrown away. */
  reset(): void {
    this.entries.clear();
  }

  private apply(control: AbstractControl, errors: NgsFormsServerErrors | null | undefined, path: string, unmatched: string[]) {
    if (errors === null || errors === undefined) return;
    if (typeof errors === 'string' || (Array.isArray(errors) && errors.length > 0 && errors.every((e) => typeof e === 'string'))) {
      this.applyKeys(control, typeof errors === 'string' ? [errors] : (errors as string[]));
      return;
    }
    if (Array.isArray(errors)) {
      if (!(control instanceof FormArray)) {
        if (errors.some((e) => !isEmpty(e))) unmatched.push(path);
        return;
      }
      errors.forEach((rowErrors, index) => {
        if (isEmpty(rowErrors)) return;
        const row = control.at(index);
        const rowPath = `${path}[${index}]`;
        if (!row) {
          unmatched.push(rowPath);
          return;
        }
        this.apply(row, rowErrors, rowPath, unmatched);
      });
      return;
    }
    if (!(control instanceof FormGroup)) {
      if (!isEmpty(errors)) unmatched.push(path);
      return;
    }
    for (const [name, childErrors] of Object.entries(errors)) {
      if (isEmpty(childErrors)) continue;
      const childPath = path ? `${path}.${name}` : name;
      const child = control.get([name]);
      if (!child) {
        unmatched.push(childPath);
        continue;
      }
      this.apply(child, childErrors, childPath, unmatched);
    }
  }

  private applyKeys(control: AbstractControl, keys: string[]) {
    this.entries.set(control, { keys, value: control.value });
    if (!control.hasValidator(this.validator)) {
      control.addValidators(this.validator);
    }
    // Show the message straight away, without waiting for the user to touch the field.
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  private validate(control: AbstractControl): ValidationErrors | null {
    const entry = this.entries.get(control);
    if (!entry) return null;
    if (!sameValue(control.value, entry.value)) {
      this.entries.delete(control);
      return null;
    }
    return Object.fromEntries(entry.keys.map((key) => [key, { [NGS_FORMS_SERVER_ERROR]: true }]));
  }
}

function isEmpty(errors: unknown): boolean {
  if (errors === null || errors === undefined || errors === '') return true;
  if (Array.isArray(errors)) return errors.every(isEmpty);
  if (typeof errors === 'object') return Object.values(errors as object).every(isEmpty);
  return false;
}

function sameValue(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
