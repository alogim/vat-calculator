it('should correctly compute the VAT amount and the price with VAT given a valid VAT rate and price without VAT', () => {
  cy.visit('/');
  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .click();
  cy.get('mat-form-field.priceWithoutVAT').type('10');
  cy.get('button[type="submit"]').click();

  cy.get('mat-form-field.vatAmount').find('input').should('have.value', '1.00');
  cy.get('mat-form-field.priceWithVAT')
    .find('input')
    .should('have.value', '11.00');
});

it('should correctly compute the price without VAT and the price with VAT given a valid VAT rate and VAT amount', () => {
  cy.visit('/');
  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .click();
  cy.get('mat-form-field.vatAmount').type('1');
  cy.get('button[type="submit"]').click();

  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', '10.00');
  cy.get('mat-form-field.priceWithVAT')
    .find('input')
    .should('have.value', '11.00');
});

it('should correctly compute the price without VAT and the VAT amount given a valid VAT rate and price with VAT', () => {
  cy.visit('/');
  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .click();
  cy.get('mat-form-field.priceWithVAT').type('11');
  cy.get('button[type="submit"]').click();

  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', '10.00');
  cy.get('mat-form-field.vatAmount').find('input').should('have.value', '1.00');
});

it('should correctly reset the form and show validation errors when clicking on the reset button', () => {
  cy.visit('/');
  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .click();
  cy.get('mat-form-field.priceWithVAT').type('11');
  cy.get('button[type="reset"]').click();

  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .should('not.be.checked');
  cy.get('mat-error.error-container').should('exist');
  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', '');
  cy.get('mat-form-field.vatAmount').find('input').should('have.value', '');
  cy.get('mat-form-field.priceWithVAT').find('input').should('have.value', '');
  cy.get('.error-container')
    .find('mat-error')
    .contains('Please enter one amount')
    .should('exist');
  cy.get('button[type="submit"]').should('be.disabled');
});

it('should correctly reset the other two amounts if the user modifies one amount', () => {
  cy.visit('/');
  cy.get('mat-radio-button')
    .find('span.mat-radio-label-content')
    .contains('10%')
    .click();
  cy.get('mat-form-field.priceWithoutVAT').type('10');
  cy.get('button[type="submit"]').click();

  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', '10');
  cy.get('mat-form-field.vatAmount').find('input').should('have.value', '1.00');
  cy.get('mat-form-field.priceWithVAT')
    .find('input')
    .should('have.value', '11.00');

  cy.get('mat-form-field.priceWithoutVAT').find('input').type('0');
  cy.get('mat-form-field.vatAmount').find('input').should('have.value', '');
  cy.get('mat-form-field.priceWithVAT').find('input').should('have.value', '');
});

it('should show "Please specify a valid number different from zero!" error if a letter is entered as amount', () => {
  cy.visit('/');
  cy.get('mat-form-field.priceWithoutVAT').type('d');
  cy.get('mat-form-field.priceWithVAT').click();

  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', 'd');
  cy.get('mat-form-field.priceWithoutVAT')
    .find('mat-error')
    .should('contain', 'Please specify a valid number different from zero!');
});

it('should show "Please specify a valid number different from zero!" error if zero is entered as amount', () => {
  cy.visit('/');
  cy.get('mat-form-field.priceWithoutVAT').type('0');
  cy.get('mat-form-field.priceWithVAT').click();

  cy.get('mat-form-field.priceWithoutVAT')
    .find('input')
    .should('have.value', '0');
  cy.get('mat-form-field.priceWithoutVAT')
    .find('mat-error')
    .should('contain', 'Please specify a valid number different from zero!');
});
