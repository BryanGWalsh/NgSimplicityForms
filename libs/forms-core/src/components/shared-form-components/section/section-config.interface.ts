import { NgsFormsFormItemContainerConfigBase } from '../../../models/index';

/** Configuration for `NgsFormsFormSectionComponent`. */
export interface NgsFormsFormSectionConfig extends NgsFormsFormItemContainerConfigBase {
  /** Section heading. It also names the section's group for assistive technology. */
  title: string;
  /**
   * Class of the title.
   * @defaultValue 'h3'
   */
  titleClass?: string;
  /**
   * Heading level (1 to 6) that assistive technology announces for the title.
   * @defaultValue 3
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Text shown under the title. */
  subtitle?: string;
  /**
   * Class of the subtitle.
   * @defaultValue 'lead'
   */
  subtitleClass?: string;
}

/** @internal */
export const sectionConfigDefaults: Partial<NgsFormsFormSectionConfig> = {
  titleClass: 'h3',
  headingLevel: 3,
  subtitleClass: 'lead',
};
