import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GroupService } from '../../../core/services/group.service';
import { GroupResponse } from '../../../core/models/group';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="container" *ngIf="group">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>{{ group.name }}</mat-card-title>
          <mat-card-subtitle>Admin: {{ group.adminUsername }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="invite-section">
            <p><strong>Invite Code:</strong></p>
            <mat-chip-set>
              <mat-chip>{{ group.inviteCode }}</mat-chip>
            </mat-chip-set>
            <p class="hint">Share this code with your friends to invite them</p>
          </div>

          <h3>Members ({{ group.members.length }}/20)</h3>
          <mat-list>
            <mat-list-item *ngFor="let member of group.members">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>{{ member.username }}</span>
              <span matListItemLine>Joined {{ member.joinedAt | date:'mediumDate' }}</span>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
        <mat-card-actions>
          <a mat-raised-button color="primary" [routerLink]="['/groups', group.id, 'leaderboard']">
            View Leaderboard
          </a>
          <a mat-stroked-button [routerLink]="['/groups', group.id, 'wagers']">
            Wagers
          </a>
          <a mat-stroked-button
             [routerLink]="currentGameweek > 0 ? ['/groups', group.id, 'trash-talk', currentGameweek] : null"
             [disabled]="currentGameweek === 0">
            Trash Talk {{ currentGameweek > 0 ? 'GW' + currentGameweek : '...' }}
          </a>
          <a mat-stroked-button [routerLink]="['/groups', group.id, 'wrapped']">
            Season Wrapped
          </a>
        </mat-card-actions>
      </mat-card>
    </div>

    <div class="container" *ngIf="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      padding: 32px;
      min-height: 100vh;
    }
    .card {
      width: 100%;
      max-width: 600px;
      height: fit-content;
    }
    .invite-section {
      margin-bottom: 24px;
    }
    .hint {
      font-size: 12px;
      color: grey;
    }
    mat-card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 16px;
    }
  `]
})
export class GroupDashboardComponent implements OnInit {
  group: GroupResponse | null = null;
  errorMessage = '';
  currentGameweek = 0;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));

    this.groupService.getGroup(groupId).subscribe({
      next: (group) => this.group = group,
      error: () => this.errorMessage = 'Group not found'
    });

    this.http.get<number>(`${environment.apiUrl}/fpl/current-gameweek`).subscribe({
      next: (gameweek) => {
        if (gameweek) this.currentGameweek = gameweek;
      },
      error: () => {}
    });
  }
}
