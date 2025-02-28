import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { InvestmentResultsComponent } from './investment-results/investment-results.component';
import { UserInputComponent } from './user-input/user-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserInputComponent, InvestmentResultsComponent],
  templateUrl: './app.component.html',
  styles: [
    `
      .app-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      main {
        flex: 1;
      }

      .footer {
        background-color: var(--color-secondary);
        color: white;
        padding: 1rem 0;
        margin-top: 3rem;
        text-align: center;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
