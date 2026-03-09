import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../../core/services/group.service';

@Component({
  selector: 'app-join-group',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Join a Group</mat-card-title>
          <mat-card-subtitle>Enter your invite code to join a group</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Invite Code</mat-label>
              <input matInput formControlName="inviteCode" placeholder="e.g. 38B0E5FC">
              <mat-error *ngIf="form.get('inviteCode')?.hasError('required')">Invite code is required</mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Join Group</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Want to create a group? <a routerLink="/groups/create">Create a group</a></p>
          <p><a routerLink="/dashboard">Back to dashboard</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .card {
      width: 100%;
      max-width: 400px;
      padding: 16px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    .error-message {
      color: red;
      margin-bottom: 12px;
      font-size: 14px;
    }
    mat-card-actions {
      text-align: center;
    }
  `]
})
export class JoinGroupComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private groupService: GroupService, private router: Router) {
    this.form = this.fb.group({
      inviteCode: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.groupService.joinGroup(this.form.value.inviteCode).subscribe({
      next: (group) => this.router.navigate(['/groups', group.id]),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid invite code';
        this.loading = false;
      }
    });
  }
}
