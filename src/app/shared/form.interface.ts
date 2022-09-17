import { ErrorCodeEnum } from './error-code.enum';

export interface AmountsGroupInterface {
  priceWithoutVAT?: string;
  vatAmount?: string;
  priceWithVAT?: string;
}

export interface FormInterface {
  selectedVATRate: string;
  amountsGroup: AmountsGroupInterface;
}

export interface FormInterfaceReply extends Partial<FormInterface> {
  errors?: Map<keyof FormInterface, ErrorCodeEnum>;
}
