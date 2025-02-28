import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { InvestmentService } from '../investment.service';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './investment-results.component.html',
  styleUrl: './investment-results.component.css',
})
export class InvestmentResultsComponent {
  private investmentService = inject(InvestmentService);

  results = computed(() => this.investmentService.resultData());

  isPositive(value: number): boolean {
    return value >= 0;
  }

  getTotalInvestment(): number {
    if (!this.results() || this.results()?.length === 0) return 0;
    const lastResult = this.results()![this.results()!.length - 1];
    return lastResult.totalAmountInvested;
  }

  getFinalValue(): number {
    if (!this.results() || this.results()?.length === 0) return 0;
    const lastResult = this.results()![this.results()!.length - 1];
    return lastResult.valueEndOfYear;
  }

  getTotalGain(): number {
    if (!this.results() || this.results()?.length === 0) return 0;
    const lastResult = this.results()![this.results()!.length - 1];
    return lastResult.totalGain;
  }

  getFinalBitcoinAmount(): number {
    if (!this.results() || this.results()?.length === 0) return 0;
    const lastResult = this.results()![this.results()!.length - 1];
    return lastResult.bitcoinAmount;
  }
}
