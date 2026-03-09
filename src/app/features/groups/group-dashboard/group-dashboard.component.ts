import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GroupService } from '../../../core/services/group.service';
import { GroupResponse } from '../../../core/models/group';

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
          <a mat-button routerLink="/dashboard">Back to Dashboard</a>
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
      background: #f5f5f5;
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
  `]
})
export class GroupDashboardComponent implements OnInit {
  group: GroupResponse | null = null;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.groupService.getGroup(groupId).subscribe({
      next: (group) => this.group = group,
      error: () => this.errorMessage = 'Group not found'
    });
  }
}
