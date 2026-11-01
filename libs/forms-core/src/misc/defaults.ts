/**
 * Simple alternative to lodash.defaults.
 * Returns a new object with properties from source assigned to target
 * if the properties are undefined or missing on target.
 */
/**
 * Returns a copy of `target` with any `undefined` properties filled in from `source`. A dependency free
 * alternative to lodash `defaults`, handy for applying default config values in custom components.
 */
export function ngsDefaults<T extends object, U extends object>(target: T, source: U): T & U;
export function ngsDefaults(target: any, ...sources: any[]): any {
  const result = target ? { ...target } : {};
  for (const source of sources) {
    if (!source) continue;
    for (const key of Object.keys(source)) {
      if (result[key] === undefined) {
        result[key] = source[key];
      }
    }
  }
  return result;
}
