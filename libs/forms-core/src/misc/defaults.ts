/**
 * Simple alternative to lodash.defaults.
 * Returns a new object with properties from source assigned to target
 * if the properties are undefined or missing on target.
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
