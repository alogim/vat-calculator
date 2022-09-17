import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorCodeEnum } from './error-code.enum';

/**
 * Returns true if the provided string contains a number different from zero,
 * false otherwise.
 *
 * @param {string | null | undefined} stringValue the string value to be analysed
 * @param strictCheck
 * @returns {boolean} true or false
 */
export const isStringAsNumberInvalid = (
  stringValue: any,
  strictCheck: boolean = false,
): boolean => {
  if (
    stringValue === null ||
    stringValue === undefined ||
    stringValue?.toString()?.trim().length === 0
  ) {
    console.log('Field does not contain anything!');
    return strictCheck;
  }

  console.log('Field control contains something!');

  const valueAsNumber: number = Number(stringValue);
  return Number.isNaN(valueAsNumber) || valueAsNumber === 0;
};

/**
 * Custom validator which sets the "notAValidNumber" error on the control if the
 * value is not a valid number different from zero.
 *
 * @returns {ValidatorFn} the "notAValidNumber" error or null
 */
export const notAValidNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isStringAsNumberInvalid(control.value)) {
      return { [ErrorCodeEnum.NOT_A_VALID_NUMBER]: true };
    }

    // eslint-disable-next-line unicorn/no-null
    return null;
  };
};
