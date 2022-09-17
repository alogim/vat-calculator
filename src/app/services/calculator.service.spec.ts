import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { ErrorCodeEnum } from '../shared/error-code.enum';
import { FormInterface, FormInterfaceReply } from '../shared/form.interface';
import { SelectedVATRateEnum } from '../shared/fields.enum';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormErrors', () => {
    it(
      'should set ' +
        ErrorCodeEnum.NOT_A_VALID_NUMBER +
        ' error if no VAT rate is specified',
      () => {
        const formValue: FormInterface = {
          amountsGroup: {
            priceWithoutVAT: '1000',
          },
        } as FormInterface;

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          SelectedVATRateEnum.SELECTED_VAT_RATE,
          ErrorCodeEnum.NOT_A_VALID_NUMBER,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.NOT_A_VALID_NUMBER +
        ' error if a zero VAT rate is specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '0',
          amountsGroup: {
            priceWithoutVAT: '1000',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          SelectedVATRateEnum.SELECTED_VAT_RATE,
          ErrorCodeEnum.NOT_A_VALID_NUMBER,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should not set ' +
        ErrorCodeEnum.NOT_A_VALID_NUMBER +
        ' error if a non-zero VAT rate is specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {
            priceWithoutVAT: '1000',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors = undefined;

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.NO_AMOUNT_SPECIFIED +
        ' error if no amount is specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {},
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set('amountsGroup', ErrorCodeEnum.NO_AMOUNT_SPECIFIED);

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.NO_AMOUNT_SPECIFIED +
        ' error if a zero amount is specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {
            priceWithoutVAT: '0',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set('amountsGroup', ErrorCodeEnum.NO_AMOUNT_SPECIFIED);

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.NO_AMOUNT_SPECIFIED +
        ' error if more than one zero amount is specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {
            priceWithoutVAT: '0',
            vatAmount: '0',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set('amountsGroup', ErrorCodeEnum.NO_AMOUNT_SPECIFIED);

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED +
        ' error if both price without VAT and VAT amount are specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {
            priceWithoutVAT: '10',
            vatAmount: '10',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          'amountsGroup',
          ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED +
        ' error if both price without VAT and price with VAT are specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '10',
          amountsGroup: {
            priceWithoutVAT: '10',
            priceWithVAT: '11',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          'amountsGroup',
          ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED +
        ' error if both price VAT amount and price with VAT are specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '0.1',
          amountsGroup: {
            vatAmount: '1',
            priceWithVAT: '11',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          'amountsGroup',
          ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );

    it(
      'should set ' +
        ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED +
        ' error if all amounts are specified',
      () => {
        const formValue: FormInterface = {
          selectedVATRate: '0.1',
          amountsGroup: {
            priceWithoutVAT: '10',
            vatAmount: '1',
            priceWithVAT: '11',
          },
        };

        const actualErrors:
          | Map<keyof FormInterface, ErrorCodeEnum>
          | undefined = service.getFormErrors(formValue);
        const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> =
          new Map();
        expectedErrors.set(
          'amountsGroup',
          ErrorCodeEnum.TOO_MANY_AMOUNTS_SPECIFIED,
        );

        expect(actualErrors).toEqual(expectedErrors);
      },
    );
  });

  describe('getResult', () => {
    it('should compute the correct VAT amount and price with VAT if the VAT rate and the price without VAT are specified', () => {
      const selectedVATRate: string = '0.1';
      const priceWithoutVAT: string = '10';

      const formValue: FormInterface = {
        selectedVATRate,
        amountsGroup: {
          priceWithoutVAT,
        },
      };

      service.getResult(formValue).subscribe((reply: FormInterfaceReply) => {
        expect(reply.errors).toBe(undefined);
        expect(reply.selectedVATRate).toBe(selectedVATRate);
        expect(reply.amountsGroup?.priceWithoutVAT).toBe(priceWithoutVAT);
        expect(reply.amountsGroup?.vatAmount).toBe('1.00');
        expect(reply.amountsGroup?.priceWithVAT).toBe('11.00');
      });
    });

    it('should compute the correct price without VAT and price with VAT if the VAT rate and the VAT amount are specified', () => {
      const selectedVATRate: string = '0.1';
      const vatAmount: string = '1';

      const formValue: FormInterface = {
        selectedVATRate,
        amountsGroup: {
          vatAmount,
        },
      };

      service.getResult(formValue).subscribe((reply: FormInterfaceReply) => {
        expect(reply.errors).toBe(undefined);
        expect(reply.selectedVATRate).toBe(selectedVATRate);
        expect(reply.amountsGroup?.priceWithoutVAT).toBe('10.00');
        expect(reply.amountsGroup?.vatAmount).toBe('1');
        expect(reply.amountsGroup?.priceWithVAT).toBe('11.00');
      });
    });

    it('should compute the correct price without VAT and VAT amount if the VAT rate and the price with VAT are specified', () => {
      const selectedVATRate: string = '0.1';
      const priceWithVAT: string = '11';

      const formValue: FormInterface = {
        selectedVATRate,
        amountsGroup: {
          priceWithVAT,
        },
      };

      service.getResult(formValue).subscribe((reply: FormInterfaceReply) => {
        expect(reply.errors).toBe(undefined);
        expect(reply.selectedVATRate).toBe(selectedVATRate);
        expect(reply.amountsGroup?.priceWithoutVAT).toBe('10.00');
        expect(reply.amountsGroup?.vatAmount).toBe('1.00');
        expect(reply.amountsGroup?.priceWithVAT).toBe('11');
      });
    });

    it('should not compute anything and set an error if no VAT rate is specified', () => {
      const selectedVATRate = undefined;
      const priceWithoutVAT: string = '10';

      const formValue: FormInterface = {
        amountsGroup: {
          priceWithoutVAT,
        },
      } as FormInterface;

      const expectedErrors: Map<keyof FormInterface, ErrorCodeEnum> = new Map();
      expectedErrors.set(
        SelectedVATRateEnum.SELECTED_VAT_RATE,
        ErrorCodeEnum.NOT_A_VALID_NUMBER,
      );

      service.getResult(formValue).subscribe((reply: FormInterfaceReply) => {
        expect(reply.errors).toEqual(expectedErrors);
        expect(reply.selectedVATRate).toBe(selectedVATRate);
        expect(reply.amountsGroup).toBe(undefined);
      });
    });
  });
});
