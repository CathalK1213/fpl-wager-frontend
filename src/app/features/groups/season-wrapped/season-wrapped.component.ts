import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { GroupService } from '../../../core/services/group.service';
import { SeasonWrappedResponse } from '../../../core/models/group';

@Component({
  selector: 'app-season-wrapped',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="container" *ngIf="wrapped">
      <div class="card-wrapper" id="wrapped-card">
        <div class="wrapped-card">
          <div class="card-header">
            <h1>⚽ FPL Wager</h1>
            <h2>Season Wrapped</h2>
            <p class="team-name">{{ wrapped.fplTeamName }}</p>
            <p class="username">{{ '@' + wrapped.username }}</p>
          </div>

          <mat-divider></mat-divider>

          <div class="stats-grid">
            <div class="stat">
              <span class="stat-value">{{ wrapped.totalPoints | number }}</span>
              <span class="stat-label">Total Points</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ wrapped.overallRank | number }}</span>
              <span class="stat-label">Overall Rank</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ wrapped.bestGameweekPoints }}</span>
              <span class="stat-label">Best GW{{ wrapped.bestGameweek }} Score</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ wrapped.groupPosition }}/{{ wrapped.totalGroupMembers }}</span>
              <span class="stat-label">{{ wrapped.groupName }} Position</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="wager-stats">
            <h3>⚡ Wager Record</h3>
            <div class="stats-grid">
              <div class="stat">
                <span class="stat-value green">{{ wrapped.wagersWon }}</span>
                <span class="stat-label">Won</span>
              </div>
              <div class="stat">
                <span class="stat-value red">{{ wrapped.wagersLost }}</span>
                <span class="stat-label">Lost</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ wrapped.wagerWinRate }}%</span>
                <span class="stat-label">Win Rate</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ wrapped.totalWagers }}</span>
                <span class="stat-label">Total Wagers</span>
              </div>
            </div>

            <div class="highlight" *ngIf="wrapped.biggestWinDescription">
              <mat-icon>emoji_events</mat-icon>
              <span>{{ wrapped.biggestWinDescription }}</span>
            </div>
          </div>

          <div class="card-footer">
            <p>GW{{ wrapped.currentGameweek }} · fplwager.app</p>
          </div>
        </div>
      </div>

      <div class="actions">
        <button mat-raised-button color="primary" (click)="share()">
          <mat-icon>share</mat-icon> Share
        </button>
        <a mat-button [routerLink]="['/groups', groupId]">Back to Group</a>
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
      max-width: 600px;
      margin: 0 auto;
    }
    .wrapped-card {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border-radius: 16px;
      padding: 32px;
      color: white;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .card-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .card-header h1 {
      font-size: 24px;
      margin: 0;
    }
    .card-header h2 {
      font-size: 32px;
      margin: 8px 0;
      color: #e94560;
    }
    .team-name {
      font-size: 20px;
      font-weight: bold;
      margin: 8px 0 4px;
    }
    .username {
      color: #aaa;
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 24px 0;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: bold;
      color: #e94560;
    }
    .stat-value.green { color: #4caf50; }
    .stat-value.red { color: #f44336; }
    .stat-label {
      display: block;
      font-size: 12px;
      color: #aaa;
      margin-top: 4px;
    }
    .wager-stats h3 {
      text-align: center;
      margin: 0 0 16px;
    }
    .highlight {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(233, 69, 96, 0.2);
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }
    .card-footer {
      text-align: center;
      margin-top: 24px;
      color: #aaa;
      font-size: 12px;
    }
    mat-divider {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;
    }
  `]
})
export class SeasonWrappedComponent implements OnInit {
  wrapped: SeasonWrappedResponse | null = null;
  groupId!: number;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.groupService.getSeasonWrapped(this.groupId).subscribe({
      next: (wrapped) => this.wrapped = wrapped,
      error: () => this.errorMessage = 'Could not load Season Wrapped'
    });
  }

  share(): void {
    if (navigator.share) {
      navigator.share({
        title: 'My FPL Season Wrapped',
        text: `${this.wrapped?.username} - ${this.wrapped?.totalPoints} pts | ${this.wrapped?.wagersWon}W ${this.wrapped?.wagersLost}L on FPL Wager`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }
}
