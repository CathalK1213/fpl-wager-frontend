import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { WagerService } from '../../../core/services/wager.service';
import { WagerResponse } from '../../../core/models/wager';

@Component({
  selector: 'app-wager-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Wagers</h2>
        <a mat-raised-button color="primary" [routerLink]="['/groups', groupId, 'wagers', 'propose']">
          + Propose Wager
        </a>
      </div>

      <div *ngIf="wagers.length === 0" class="empty">
        <p>No wagers yet. Be the first to propose one!</p>
      </div>

      <mat-card *ngFor="let wager of wagers" class="wager-card">
        <mat-card-header>
          <mat-card-title>{{ wager.proposerUsername }} vs {{ wager.opponentUsername }}</mat-card-title>
          <mat-card-subtitle>{{ wager.groupName }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ wager.description }}</p>
          <div class="chips">
            <mat-chip [class]="getStatusClass(wager.status)">{{ wager.status }}</mat-chip>
            <mat-chip>{{ getStakeLabel(wager) }}</mat-chip>
            <mat-chip>{{ wager.wagerType === 'ONCE_OFF' ? 'GW' + wager.gameweek : 'Season' }}</mat-chip>
          </div>
          <p *ngIf="wager.winnerUsername" class="winner">
            🏆 Winner: {{ wager.winnerUsername }}
          </p>
        </mat-card-content>
        <mat-card-actions *ngIf="wager.status === 'PROPOSED' && wager.opponentUsername === currentUsername">
          <button mat-raised-button color="primary" (click)="respond(wager.id, 'ACCEPT')">Accept</button>
          <button mat-stroked-button color="warn" (click)="respond(wager.id, 'DECLINE')">Decline</button>
        </mat-card-actions>
      </mat-card>

      <div class="back">
        <a mat-button [routerLink]="['/groups', groupId]">Back to Group</a>
        <a mat-stroked-button [routerLink]="['/groups', groupId, 'debts']">My Debts</a>
      </div>
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
    .wager-card {
      margin-bottom: 16px;
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .winner {
      margin-top: 8px;
      font-weight: bold;
    }
    .empty {
      text-align: center;
      padding: 48px;
      color: grey;
    }
    .back {
      margin-top: 16px;
    }
    .status-proposed { background: orange; }
    .status-accepted { background: green; color: white; }
    .status-declined { background: red; color: white; }
    .status-completed { background: purple; color: white; }
  `]
})
export class WagerListComponent implements OnInit {
  wagers: WagerResponse[] = [];
  groupId!: number;
  currentUsername = '';

  constructor(private route: ActivatedRoute, private wagerService: WagerService) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUsername = JSON.parse(storedUser).username;
    }
    this.loadWagers();
  }

  loadWagers(): void {
    this.wagerService.getGroupWagers(this.groupId).subscribe({
      next: (wagers) => this.wagers = wagers,
      error: () => {}
    });
  }

  respond(wagerId: number, action: 'ACCEPT' | 'DECLINE'): void {
    this.wagerService.respondToWager(wagerId, action).subscribe({
      next: () => this.loadWagers()
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStakeLabel(wager: WagerResponse): string {
    const labels: Record<string, string> = {
      PINT: '🍺 Pint',
      COFFEE: '☕ Coffee',
      MEAL: '🍽️ Meal',
      MONEY: `💰 €${wager.stakeAmount}`,
      OTHER: wager.stakeDescription || 'Other'
    };
    return labels[wager.stakeType] || wager.stakeType;
  }
}
