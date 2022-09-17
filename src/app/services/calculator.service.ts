import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ErrorCodeEnum } from '../shared/error-code.enum';
import {
  AmountsGroupInterface,
  FormInterface,
  FormInterfaceReply,
} from '../shared/form.interface';
import { SelectedVATRateEnum } from '../shared/fields.enum';
import { isStringAsNumberInvalid } from '../shared/helper';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  /**
   * Returns
   *
   * @param formValue
   */
  getResult(formValue: FormInterface): Observable<FormInterfaceReply> {
    const formErrors: Map<keyof FormInterface, ErrorCodeEnum> | undefined =
      this.getFormErrors(formValue);
    if (formErrors) {
      return of({ errors: formErrors });
    }

    let selectedVATRate, priceWithVAT, vatAmount, priceWithoutVAT;
    selectedVATRate = Number(formValue.selectedVATRate);
    priceWithoutVAT = Number(formValue.amountsGroup.priceWithoutVAT);
    vatAmount = Number(formValue.amountsGroup.vatAmount);
    priceWithVAT = Number(formValue.amountsGroup.priceWithVAT);

    // vatAmount = priceWithVAT - priceWithoutVAT;
    // vatAmount = priceWithoutVAT * selectedVATRate;
    // priceWithVAT - priceWithoutVAT = priceWithoutVAT * selectedVATRate
    // priceWithoutVAT * (selectedVATRate + 1) = priceWithVAT
    // priceWithoutVAT = priceWithVAT / (selectedVATRate + 1)

    let returnValue: FormInterfaceReply = {
      selectedVATRate: formValue.selectedVATRate,
    };

    if (priceWithoutVAT) {
      vatAmount = priceWithoutVAT * selectedVATRate;
      priceWithVAT = vatAmount + priceWithoutVAT;
      returnValue = {
        ...returnValue,
        amountsGroup: {
          priceWithoutVAT: formValue.amountsGroup.priceWithoutVAT,
          vatAmount: vatAmount.toFixed(2),
          priceWithVAT: priceWithVAT.toFixed(2),
        },
      };
    } else if (vatAmount) {
      priceWithoutVAT = vatAmount / selectedVATRate;
      priceWithVAT = vatAmount + priceWithoutVAT;
      returnValue = {
        ...returnValue,
        amountsGroup: {
          priceWithoutVAT: priceWithoutVAT.toFixed(2),
          vatAmount: formValue.amountsGroup.vatAmount,
          priceWithVAT: priceWithVAT.toFixed(2),
        },
      };
    } else {
      priceWithoutVAT = priceWithVAT / (selectedVATRate + 1);
      vatAmount = priceWithVAT - priceWithoutVAT;
      returnValue = {
        ...returnValue,
        amountsGroup: {
          priceWithoutVAT: priceWithoutVAT.toFixed(2),
          vatAmount: vatAmount.toFixed(2),
          priceWithVAT: formValue.amountsGroup.priceWithVAT,
        },
      };
    }

    return of(returnValue);

    // Simulate an API call (in the backend we should make sure the input is a valid number different from zero, because
    // even though the input is validated in the frontend, the API call might be called directly by another service
    // which does not perform validations/sanitization)
  }

  /**
   * Parses the JSON containing the form values and checks if it is valid:
   *  - if no VAT rate is selected, an error is added
   *  - if no amount is present, an error is added
   *  - if more than one amount is present, an error is added
   *
   * @param {FormInterface} formValue a JSON object containing the form's values
   * @returns {Map<keyof FormInterface, ErrorCodeEnum>} a map with the errors or
   * undefined if no error is defined
   */
  getFormErrors(
    formValue: FormInterface,
  ): Map<keyof FormInterface, ErrorCodeEnum> | undefined {
    const errorCodes: Map<keyof FormInterface, ErrorCodeEnum> = new Map();
    let numberOfSpecifiedAmounts: number = 0;

    if (isStringAsNumberInvalid(formValue.selectedVATRate, true)) {
      errorCodes.set(
        SelectedVATRateEnum.SELECTED_VAT_RATE,
        ErrorCodeEnum.NOT_A_VALID_NUMBER,
      );
    }

    for (const key in formValue.amountsGroup) {
      if (
        !isStringAsNumberInvalid(
          formValue.amountsGroup[key as keyof AmountsGroupInterface],
          true,
        )
      ) {
        numberOfSpecifiedAmounts++;
      }
    }

    if (numberOfSpecifiedAmounts === 0) {
      errorCodes.set('amountsGroup', ErrorCodeEnum.NO_AMOUNT_SPECIFIED);
    } else if (numberOfSpecifiedAmounts > 1) {
      errorCodes.set('amountsGroup', ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED);
    }

    return errorCodes.size === 0 ? undefined : errorCodes;
  }
}
