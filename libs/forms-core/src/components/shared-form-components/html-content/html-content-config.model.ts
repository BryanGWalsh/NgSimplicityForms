import { NgsFormsFormItemConfigBase } from '../../../models';

/** Configuration for `NgsFormsHtmlContentComponent`. */
export interface NgsFormItemHtmlContentConfig extends NgsFormsFormItemConfigBase {
  /** The HTML to render. */
  html: string;
  /** Reserved. The HTML is always sanitized. */
  sanitize: boolean;
}
