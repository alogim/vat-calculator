import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorService } from './services/calculator.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { CapitaliseFirstLetterPipe } from './shared/pipes/capitalise-first-letter.pipe';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [AppComponent, CapitaliseFirstLetterPipe],
      providers: [CalculatorService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title inside the top toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar span')?.textContent).toContain(
      'Vat Calculator',
    );
  });

  describe('form', () => {
    it('should render the form element', () => {
      const form = fixture.debugElement.queryAll(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should render the mat-radio-group and the corresponding label inside a div with class "radio-group-container"', () => {
      const divRadioGroupContainer: DebugElement[] =
        fixture.debugElement.queryAll(By.css('.radio-group-container'));
      expect(divRadioGroupContainer).toBeTruthy();

      const radioGroupLabel = divRadioGroupContainer[0].queryAll(
        By.css('label#vat-rate-radio-group-label'),
      );
      expect(radioGroupLabel).toBeTruthy();

      const radioGroup = divRadioGroupContainer[0].queryAll(
        By.css('mat-radio-group.vat-rate-radio-group'),
      );
      expect(radioGroup).toBeTruthy();

      const radioButton = radioGroup[0].queryAll(
        By.css('mat-radio-button.vat-rate-radio-button'),
      );
      expect(radioButton).toBeTruthy();
      expect(radioButton.length).toBe(3);
    });

    it('should render the amounts input fields and their labels', () => {
      const amountsFields: DebugElement[] = fixture.debugElement.queryAll(
        By.css('mat-form-field > input'),
      );
      expect(amountsFields).toBeTruthy();
      expect(amountsFields.length).toBe(3);

      const fieldsLabels: DebugElement[] = fixture.debugElement.queryAll(
        By.css('mat-form-field > label'),
      );
      expect(amountsFields).toBeTruthy();
      expect(amountsFields.length).toBe(3);
    });

    it('should render the errors container', () => {
      const errorsContainer: DebugElement[] = fixture.debugElement.queryAll(
        By.css('div.error-container'),
      );
      expect(errorsContainer).toBeTruthy();
    });

    it('should render the buttons inside the buttons container', () => {
      const buttonsContainer: DebugElement[] = fixture.debugElement.queryAll(
        By.css('div.buttons-container'),
      );
      expect(buttonsContainer).toBeTruthy();

      const buttons = buttonsContainer[0].queryAll(By.css('button'));
      expect(buttons).toBeTruthy();
      expect(buttons.length).toBe(2);
    });
  });
});
