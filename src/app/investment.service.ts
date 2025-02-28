import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { InvestmentInput } from './investment-input.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService implements OnDestroy {
  resultData = signal<
    | {
        year: number;
        bitcoinPrice: number;
        bitcoinAmount: number;
        valueEndOfYear: number;
        annualInvestment: number;
        totalGain: number;
        totalAmountInvested: number;
      }[]
    | undefined
  >(undefined);

  currentBitcoinPrice = signal<number>(0);
  lastUpdated = signal<Date>(new Date());
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private priceUpdateSubscription: Subscription;

  constructor(private http: HttpClient) {
    // Récupération initiale du prix
    this.fetchCurrentBitcoinPrice();

    // Mise à jour du prix toutes les 60 secondes (1 minute)
    this.priceUpdateSubscription = interval(60000)
      .pipe(
        switchMap(() => {
          this.isLoading.set(true);
          return this.http
            .get<any>(
              'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur'
            )
            .pipe(
              catchError((err) => {
                this.error.set(
                  'Erreur lors de la récupération du prix du Bitcoin: ' +
                    err.message
                );
                this.isLoading.set(false);
                throw err;
              })
            );
        })
      )
      .subscribe({
        next: (data) => {
          if (data && data.bitcoin && data.bitcoin.eur) {
            this.currentBitcoinPrice.set(data.bitcoin.eur);
            this.lastUpdated.set(new Date());
            this.error.set(null);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy() {
    // Nettoyage de l'abonnement lors de la destruction du service
    if (this.priceUpdateSubscription) {
      this.priceUpdateSubscription.unsubscribe();
    }
  }

  fetchCurrentBitcoinPrice() {
    this.isLoading.set(true);
    this.http
      .get<any>(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur'
      )
      .subscribe({
        next: (data) => {
          if (data && data.bitcoin && data.bitcoin.eur) {
            this.currentBitcoinPrice.set(data.bitcoin.eur);
            this.lastUpdated.set(new Date());
            this.error.set(null);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(
            'Erreur lors de la récupération du prix du Bitcoin: ' + err.message
          );
          this.isLoading.set(false);
        },
      });
  }

  // Méthode pour forcer une mise à jour manuelle
  refreshBitcoinPrice() {
    this.fetchCurrentBitcoinPrice();
  }

  onCalculateInvestmentResults(data: InvestmentInput) {
    const { initialInvestment, annualInvestment, expectedReturn, duration } =
      data;
    const annualData = [];

    // Montant initial en Bitcoin
    let bitcoinAmount = initialInvestment / this.currentBitcoinPrice();
    let investmentValue = initialInvestment;
    let currentBitcoinPrice = this.currentBitcoinPrice();

    for (let i = 0; i < duration; i++) {
      const year = i + 1;

      // Augmentation estimée du prix du Bitcoin selon le taux de croissance attendu
      currentBitcoinPrice = currentBitcoinPrice * (1 + expectedReturn / 100);

      // Achat de Bitcoin supplémentaire avec l'investissement annuel
      const annualBitcoinPurchase = annualInvestment / currentBitcoinPrice;
      bitcoinAmount += annualBitcoinPurchase;

      // Valeur totale en euros
      const valueEndOfYear = bitcoinAmount * currentBitcoinPrice;

      // Gain total (valeur actuelle - montants investis)
      const totalGain =
        valueEndOfYear - (initialInvestment + annualInvestment * year);

      annualData.push({
        year: year,
        bitcoinPrice: currentBitcoinPrice,
        bitcoinAmount: bitcoinAmount,
        valueEndOfYear: valueEndOfYear,
        annualInvestment: annualInvestment,
        totalGain: totalGain,
        totalAmountInvested: initialInvestment + annualInvestment * year,
      });
    }

    this.resultData.set(annualData);
  }
}
