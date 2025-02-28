import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../investment.service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css',
})
export class UserInputComponent {
  enteredInititialInvestment = signal('1000');
  enteredAnnualInvestment = signal('500');
  enteredExpectedReturn = signal('20');
  enteredDuration = signal('10');

  private investmentService = inject(InvestmentService);

  bitcoinPrice = this.investmentService.currentBitcoinPrice;
  lastUpdated = this.investmentService.lastUpdated;
  isLoading = this.investmentService.isLoading;
  error = this.investmentService.error;

  refreshPrice() {
    this.investmentService.refreshBitcoinPrice();
  }

  onSubmit() {
    this.investmentService.onCalculateInvestmentResults({
      initialInvestment: +this.enteredInititialInvestment(),
      annualInvestment: +this.enteredAnnualInvestment(),
      expectedReturn: +this.enteredExpectedReturn(),
      duration: +this.enteredDuration(),
    });

    this.enteredInititialInvestment.set('1000');
    this.enteredAnnualInvestment.set('500');
    this.enteredExpectedReturn.set('20');
    this.enteredDuration.set('10');
  }
}
