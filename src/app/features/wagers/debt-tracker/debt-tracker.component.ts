import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { WagerService } from '../../../core/services/wager.service';
import { DebtSummary, DebtEntry, StakeType } from '../../../core/models/wager';

@Component({
  selector: 'app-debt-tracker',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="container" *ngIf="debtSummary">
      <div class="header">
        <h2>Debt Tracker</h2>
        <mat-chip-set>
          <mat-chip color="primary">{{ debtSummary.totalWagersWon }} Won</mat-chip>
          <mat-chip color="warn">{{ debtSummary.totalWagersLost }} Lost</mat-chip>
        </mat-chip-set>
      </div>

      <!-- Owed to you -->
      <mat-card class="card">
        <mat-card-header>
          <mat-icon mat-card-avatar style="color: green">arrow_downward</mat-icon>
          <mat-card-title>Owed to You</mat-card-title>
          <mat-card-subtitle>{{ debtSummary.owedBy.length }} outstanding</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="debtSummary.owedBy.length === 0" class="empty">
            Nothing owed to you yet.
          </div>
          <div *ngFor="let debt of debtSummary.owedBy" class="debt-item">
            <div class="debt-info">
              <strong>{{ debt.counterpartyUsername }}</strong> owes you
              <span class="stake">{{ getStakeLabel(debt) }}</span>
            </div>
            <mat-divider></mat-divider>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- You owe -->
      <mat-card class="card">
        <mat-card-header>
          <mat-icon mat-card-avatar style="color: red">arrow_upward</mat-icon>
          <mat-card-title>You Owe</mat-card-title>
          <mat-card-subtitle>{{ debtSummary.owes.length }} outstanding</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="debtSummary.owes.length === 0" class="empty">
            You don't owe anyone anything.
          </div>
          <div *ngFor="let debt of debtSummary.owes" class="debt-item">
            <div class="debt-info">
              You owe <strong>{{ debt.counterpartyUsername }}</strong>
              <span class="stake">{{ getStakeLabel(debt) }}</span>
            </div>
            <mat-divider></mat-divider>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="actions">
        <a mat-button [routerLink]="['/groups', groupId, 'wagers']">Back to Wagers</a>
        <a mat-button routerLink="/dashboard">Dashboard</a>
      </div>
    </div>

    <div class="container" *ngIf="errorMessage">
      <p>{{ errorMessage }}</p>
      <a mat-button routerLink="/dashboard">Back to Dashboard</a>
    </div>
  `,
  styles: [`
    .container {
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .card {
      margin-bottom: 16px;
    }
    .debt-item {
      padding: 12px 0;
    }
    .debt-info {
      margin-bottom: 8px;
    }
    .stake {
      margin-left: 8px;
      font-weight: bold;
      color: #0f2540;
    }
    .empty {
      color: grey;
      font-style: italic;
      padding: 8px 0;
    }
    .actions {
      margin-top: 16px;
    }
  `]
})
export class DebtTrackerComponent implements OnInit {
  debtSummary: DebtSummary | null = null;
  groupId!: number;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private wagerService: WagerService) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.wagerService.getMyDebts(this.groupId).subscribe({
      next: (summary) => this.debtSummary = summary,
      error: () => this.errorMessage = 'Could not load debt summary'
    });
  }

  getStakeLabel(debt: DebtEntry): string {
    const labels: Record<StakeType, string> = {
      PINT: '🍺 Pint',
      COFFEE: '☕ Coffee',
      MEAL: '🍽️ Meal',
      MONEY: `💰 €${debt.stakeAmount}`,
      OTHER: debt.stakeDescription || 'Other'
    };
    return labels[debt.stakeType];
  }
}
