import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { GroupService } from '../../core/services/group.service';
import { GroupResponse } from '../../core/models/group';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatListModule, MatIconModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Welcome, {{ (authService.currentUser$ | async)?.username }}!</h1>
        <button mat-raised-button color="warn" (click)="authService.logout()">Logout</button>
      </div>

      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Your Groups</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list *ngIf="groups.length > 0">
            <mat-list-item *ngFor="let group of groups" [routerLink]="['/groups', group.id]"
                           style="cursor: pointer">
              <mat-icon matListItemIcon>group</mat-icon>
              <span matListItemTitle>{{ group.name }}</span>
              <span matListItemLine>{{ group.members.length }} members</span>
            </mat-list-item>
          </mat-list>
          <p *ngIf="groups.length === 0">You haven't joined any groups yet.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/groups/create">Create Group</button>
          <button mat-stroked-button routerLink="/groups/join">Join Group</button>
        </mat-card-actions>
      </mat-card>
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
      margin-bottom: 24px;
    }
    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  groups: GroupResponse[] = [];

  constructor(public authService: AuthService, private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getMyGroups().subscribe({
      next: (groups) => this.groups = groups,
      error: () => {}
    });
  }
}
