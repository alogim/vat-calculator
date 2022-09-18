import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CalculatorService } from './services/calculator.service';
import { ErrorCodeEnum } from './shared/error-code.enum';
import {
  isStringAsNumberInvalid,
  notAValidNumberValidator,
} from './shared/helper';
import { AmountsFieldsEnum, SelectedVATRateEnum } from './shared/fields.enum';
import { TranslateService } from '@ngx-translate/core';
import { FormInterfaceReply } from './shared/form.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  myForm!: FormGroup;
  readonly vatRates: number[] = [0.1, 0.13, 0.2];
  public AmountsFieldsEnum: typeof AmountsFieldsEnum = AmountsFieldsEnum;
  public ErrorCodeEnum: typeof ErrorCodeEnum = ErrorCodeEnum;
  private subscriptions: Subscription[] = [];

  constructor(
    formBuilder: FormBuilder,
    private calculatorService: CalculatorService,
    translateService: TranslateService,
  ) {
    this.initialiseForm();
    translateService.setDefaultLang('en');
  }

  get selectedVATRateControl(): FormControl {
    return this.myForm.get('selectedVATRate') as FormControl;
  }

  get priceWithoutVATControl(): FormControl {
    return this.amountsGroup.get('priceWithoutVAT') as FormControl;
  }

  get priceWithVATControl(): FormControl {
    return this.amountsGroup.get('priceWithVAT') as FormControl;
  }

  get vatAmountControl(): FormControl {
    return this.amountsGroup.get('vatAmount') as FormControl;
  }

  get amountsGroup(): FormGroup {
    return this.myForm.get('amountsGroup') as FormGroup;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to release all resources
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Custom validator to which:
   *  - sets the "allAmountsAreEmpty" error if no amount is specified
   *  - sets the "tooManyAmountsSpecified" error if more than one amount is specified
   *  - resets the errors on the control otherwise
   *
   * @returns {ValidatorFn} the "allAmountsAreEmpty" error, the
   * "tooManyAmountsSpecified" error or null
   */
  readonly areAmountsSpecifiedCorrectly = (): ValidatorFn => {
    return (): ValidationErrors | null => {
      const definedValues =
        (isStringAsNumberInvalid(this.priceWithoutVATControl.value, true)
          ? 0
          : 1) +
        (isStringAsNumberInvalid(this.vatAmountControl.value, true) ? 0 : 1) +
        (isStringAsNumberInvalid(this.priceWithVATControl.value, true) ? 0 : 1);

      if (definedValues === 0) {
        return { [ErrorCodeEnum.NO_AMOUNT_SPECIFIED]: true };
      } else if (definedValues > 1) {
        return { [ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED]: true };
      } else {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }
    };
  };

  /**
   * Calls the calculator service to compute the amounts.
   * Sets the values and the errors on the form fields according to the returned
   * values from the function call.
   */
  compute(): void {
    this.subscriptions.push(
      this.calculatorService
        // Pass the raw value of the form, corresponding to a JSON representation
        // of it with all fields/groups
        .getResult(this.myForm.getRawValue())
        .subscribe((result: FormInterfaceReply) => {
          // If there are some errors, check them out
          if (result.errors) {
            const amountsGroupError = result.errors.get('amountsGroup');

            if (
              amountsGroupError === ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED
            ) {
              this.amountsGroup.setErrors({
                [ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED]: true,
              });
            } else if (
              amountsGroupError === ErrorCodeEnum.NO_AMOUNT_SPECIFIED
            ) {
              this.amountsGroup.setErrors({
                [ErrorCodeEnum.NO_AMOUNT_SPECIFIED]: true,
              });
            }
          } else {
            this.myForm.patchValue(result);

            /* eslint-disable unicorn/no-null */
            // Temporarily remove all errors from the form: as soon as the user
            // edits one of the form control or clicks on the submit button, the
            // validators are run again automatically
            this.amountsGroup.setErrors(null);
            this.priceWithoutVATControl.setErrors(null);
            this.vatAmountControl.setErrors(null);
            this.priceWithVATControl.setErrors(null);
            /* eslint-enable unicorn/no-null */
          }
        }),
    );
  }

  /**
   * Resets all the form controls in the amounts group except for the one passed
   * as parameter.
   * This function is called whenever the user edits one of the input fields, so
   * that only one field at a time can be modified.
   *
   * @param {AmountsFieldsEnum} priceWithoutVAT the form control to keep as it
   * is
   */
  resetOtherAmounts(priceWithoutVAT: AmountsFieldsEnum): void {
    switch (priceWithoutVAT) {
      case AmountsFieldsEnum.PRICE_WITHOUT_VAT:
        this.vatAmountControl.reset();
        this.priceWithVATControl.reset();
        break;
      case AmountsFieldsEnum.VAT_AMOUNT:
        this.priceWithoutVATControl.reset();
        this.priceWithVATControl.reset();
        break;
      case AmountsFieldsEnum.PRICE_WITH_VAT:
        this.priceWithoutVATControl.reset();
        this.vatAmountControl.reset();
        break;
    }
  }

  /**
   * Initialises the form with the appropriate form controls and validators
   *
   * @private
   */
  private initialiseForm() {
    this.myForm = new FormGroup({
      [SelectedVATRateEnum.SELECTED_VAT_RATE]: new FormControl(undefined, [
        Validators.required,
      ]),
      amountsGroup: this.buildAndGetAmountsFormGroup(),
    });
  }

  /**
   * Builds and returns a form group for the amounts fields (price without VAT,
   * VAT amount and price with VAT) with the appropriate validators.
   *
   * @private
   * @returns {FormGroup} a new FormGroup
   */
  private buildAndGetAmountsFormGroup(): FormGroup {
    const amountsGroup = new FormGroup({});

    for (const value of Object.values(AmountsFieldsEnum)) {
      amountsGroup.addControl(
        value,
        new FormControl(undefined, notAValidNumberValidator()),
      );
    }

    amountsGroup.addValidators(this.areAmountsSpecifiedCorrectly());

    return amountsGroup;
  }
}
