/** One option of a radio group or select. */
export interface NgsFormsFormInputOption {
  /** Value written to the form control when the option is chosen. */
  id: string;
  /** Text shown to the user. */
  label: string;
  /** Renders the option but prevents choosing it. */
  disabled?: boolean;
}
