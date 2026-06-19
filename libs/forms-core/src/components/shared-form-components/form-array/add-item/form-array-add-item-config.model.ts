import { NgsFormsFormItemConfigBase } from '../../../../models';

export interface NgsFormItemArrayAddItemConfig extends NgsFormsFormItemConfigBase {
  buttonText?: string;
  buttonClass?: string;
  buttonIcon?: string;
  onAddItem?: () => void;
}
