/**
 * Shape for server side validation errors, nested to mirror the form structure.
 *
 * @notImplemented
 * @remarks Reserved for future use: nothing in the library consumes it yet.
 */
export interface NgsServerSideValidationErrorObjectType {
  key: string;
  path: string;
  hasErrors: boolean;
  errorList: string[];
  children: NgsServerSideValidationErrorObjectType[];
}
