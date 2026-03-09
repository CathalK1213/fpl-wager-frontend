import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { GroupService } from '../../core/services/group.service';
import { UserService } from '../../core/services/user.service';
import { GroupResponse } from '../../core/models/group';
import { FplEntry } from '../../core/models/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Welcome, {{ (authService.currentUser$ | async)?.username }}!</h1>
        <button mat-raised-button color="warn" (click)="authService.logout()">Logout</button>
      </div>

      <!-- FPL Team Card -->
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Your FPL Team</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="fplEntry; else linkTeam">
            <p><strong>{{ fplEntry.name }}</strong></p>
            <p>GW{{ fplEntry.current_event }} Points: <strong>{{ fplEntry.summary_event_points }}</strong></p>
            <p>Overall Points: <strong>{{ fplEntry.summary_overall_points }}</strong></p>
            <p>Overall Rank: <strong>{{ fplEntry.summary_overall_rank | number }}</strong></p>
          </div>
          <ng-template #linkTeam>
            <p>Link your FPL team to track your scores.</p>
            <form [formGroup]="fplForm" (ngSubmit)="onLinkFplTeam()">
              <mat-form-field appearance="outline">
                <mat-label>FPL Team ID</mat-label>
                <input matInput formControlName="fplTeamId" type="number" placeholder="e.g. 7868045">
                <mat-hint>Find this in the URL on the FPL website</mat-hint>
                <mat-error *ngIf="fplForm.get('fplTeamId')?.hasError('required')">Team ID is required</mat-error>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="fplLoading">
                Link Team
              </button>
            </form>
            <p class="error" *ngIf="fplError">{{ fplError }}</p>
          </ng-template>
        </mat-card-content>
      </mat-card>

      <!-- Groups Card -->
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
    mat-form-field {
      margin-right: 12px;
    }
    .error {
      color: red;
      font-size: 14px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  groups: GroupResponse[] = [];
  fplEntry: FplEntry | null = null;
  fplForm: FormGroup;
  fplLoading = false;
  fplError = '';

  constructor(
    public authService: AuthService,
    private groupService: GroupService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.fplForm = this.fb.group({
      fplTeamId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupService.getMyGroups().subscribe({
      next: (groups) => this.groups = groups,
      error: () => {}
    });
  }

  onLinkFplTeam(): void {
    if (this.fplForm.invalid) return;
    this.fplLoading = true;
    this.fplError = '';

    this.userService.linkFplTeam(this.fplForm.value.fplTeamId).subscribe({
      next: (entry) => {
        this.fplEntry = entry;
        this.fplLoading = false;
      },
      error: () => {
        this.fplError = 'Could not find that FPL team. Check the ID and try again.';
        this.fplLoading = false;
      }
    });
  }
}
