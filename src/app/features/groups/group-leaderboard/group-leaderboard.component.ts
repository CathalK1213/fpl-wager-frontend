import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../../core/services/group.service';
import { LeaderboardResponse, LeaderboardEntry } from '../../../core/models/group';

@Component({
  selector: 'app-group-leaderboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="leaderboard && !loading">
        <div class="header">
          <h2>{{ leaderboard.groupName }}</h2>
          <mat-chip-set>
            <mat-chip>Gameweek {{ leaderboard.currentGameweek }}</mat-chip>
          </mat-chip-set>
        </div>

        <mat-card>
          <mat-card-content>
            <table mat-table [dataSource]="leaderboard.standings" class="full-width">

              <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let entry">
                  <mat-icon *ngIf="entry.position === 1" style="color: gold">emoji_events</mat-icon>
                  <mat-icon *ngIf="entry.position === 2" style="color: silver">emoji_events</mat-icon>
                  <mat-icon *ngIf="entry.position === 3" style="color: #cd7f32">emoji_events</mat-icon>
                  <span *ngIf="entry.position > 3">{{ entry.position }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="team">
                <th mat-header-cell *matHeaderCellDef>Team</th>
                <td mat-cell *matCellDef="let entry">
                  <div><strong>{{ entry.username }}</strong></div>
                  <div class="team-name">{{ entry.fplTeamName }}</div>
                </td>
              </ng-container>

              <ng-container matColumnDef="gwPoints">
                <th mat-header-cell *matHeaderCellDef>GW{{ leaderboard.currentGameweek }}</th>
                <td mat-cell *matCellDef="let entry">
                  <strong>{{ entry.gameweekPoints ?? '-' }}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="totalPoints">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let entry">{{ entry.totalPoints ?? '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="rank">
                <th mat-header-cell *matHeaderCellDef>OR</th>
                <td mat-cell *matCellDef="let entry">
                  {{ entry.overallRank ? (entry.overallRank | number) : '-' }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button [routerLink]="['/groups', leaderboard.groupId]">Group Details</a>
            <a mat-button routerLink="/dashboard">Dashboard</a>
            <a mat-stroked-button [routerLink]="['/groups', leaderboard.groupId, 'wagers']">
              Wagers
            </a>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="errorMessage">
        <p>{{ errorMessage }}</p>
        <a mat-button routerLink="/dashboard">Back to Dashboard</a>
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
    .full-width {
      width: 100%;
    }
    .team-name {
      font-size: 12px;
      color: grey;
    }
    .loading {
      display: flex;
      justify-content: center;
      padding: 64px;
    }
  `]
})
export class GroupLeaderboardComponent implements OnInit {
  leaderboard: LeaderboardResponse | null = null;
  loading = true;
  errorMessage = '';
  displayedColumns = ['position', 'team', 'gwPoints', 'totalPoints', 'rank'];

  constructor(private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.groupService.getLeaderboard(groupId).subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load leaderboard';
        this.loading = false;
      }
    });
  }
}
