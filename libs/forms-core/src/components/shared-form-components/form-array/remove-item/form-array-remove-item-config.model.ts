import { NgsFormsFormItemConfigBase } from '../../../../models';

export interface NgsFormItemArrayRemoveItemConfig extends NgsFormsFormItemConfigBase {
  buttonText?: string;
  buttonClass?: string;
  buttonIcon?: string;
  onRemoveItem?: () => void;
}
