import { NgsFormsFormItemContainerConfigBase } from '../../../models/index';

export interface NgsFormsFormSectionConfig extends NgsFormsFormItemContainerConfigBase {
  title: string;
  titleClass?: string;
  subtitle?: string;
  subtitleClass?: string;
}

export const sectionConfigDefaults: Partial<NgsFormsFormSectionConfig> = {
  titleClass: 'h3',
  subtitleClass: 'lead',
};
