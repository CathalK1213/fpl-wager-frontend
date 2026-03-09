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
  selector: 'app-create-group',
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
          <mat-card-title>Create a Group</mat-card-title>
          <mat-card-subtitle>Start a new FPL Wager group for your friends</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Group Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g. The Lads">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Group name is required</mat-error>
              <mat-error *ngIf="form.get('name')?.hasError('minlength')">Minimum 3 characters</mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Create Group</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Have an invite code? <a routerLink="/groups/join">Join a group</a></p>
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
export class CreateGroupComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private groupService: GroupService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.groupService.createGroup(this.form.value).subscribe({
      next: (group) => this.router.navigate(['/groups', group.id]),
      error: () => {
        this.errorMessage = 'Something went wrong';
        this.loading = false;
      }
    });
  }
}
