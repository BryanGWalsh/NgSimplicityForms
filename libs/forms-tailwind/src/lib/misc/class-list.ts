/** Joins class lists, skipping empty values. Internal helper for the component templates. */
export function ngsTwClassList(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
