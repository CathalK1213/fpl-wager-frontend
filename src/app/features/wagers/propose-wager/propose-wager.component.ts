import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WagerService } from '../../../core/services/wager.service';
import { GroupService } from '../../../core/services/group.service';
import { GroupResponse, MemberResponse } from '../../../core/models/group';

@Component({
  selector: 'app-propose-wager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>Propose a Wager</mat-card-title>
          <mat-card-subtitle>{{ group?.name }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Opponent</mat-label>
              <mat-select formControlName="opponentId">
                <mat-option *ngFor="let member of opponents" [value]="member.userId">
                  {{ member.username }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('opponentId')?.hasError('required')">Select an opponent</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Wager Description</mat-label>
              <textarea matInput formControlName="description" rows="3"
                        placeholder="e.g. I will outscore you this gameweek"></textarea>
              <mat-error *ngIf="form.get('description')?.hasError('required')">Description is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Stake</mat-label>
              <mat-select formControlName="stakeType">
                <mat-option value="PINT">🍺 Pint</mat-option>
                <mat-option value="COFFEE">☕ Coffee</mat-option>
                <mat-option value="MEAL">🍽️ Meal</mat-option>
                <mat-option value="MONEY">💰 Money</mat-option>
                <mat-option value="OTHER">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('stakeType')?.value === 'MONEY'">
              <mat-label>Amount (€)</mat-label>
              <input matInput type="number" formControlName="stakeAmount">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('stakeType')?.value === 'OTHER'">
              <mat-label>Describe the stake</mat-label>
              <input matInput formControlName="stakeDescription">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Wager Type</mat-label>
              <mat-select formControlName="wagerType">
                <mat-option value="ONCE_OFF">Once Off (single gameweek)</mat-option>
                <mat-option value="RECURRING">Recurring (whole season)</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('wagerType')?.value === 'ONCE_OFF'">
              <mat-label>Gameweek</mat-label>
              <input matInput type="number" formControlName="gameweek" placeholder="e.g. 29">
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Propose Wager</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button [routerLink]="['/groups', groupId, 'wagers']">Cancel</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      padding: 32px;
      background: transparent;
      min-height: 100vh;
    }
    .card {
      width: 100%;
      max-width: 500px;
      height: fit-content;
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
export class ProposeWagerComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMessage = '';
  group: GroupResponse | null = null;
  opponents: MemberResponse[] = [];
  groupId!: number;
  currentUsername = '';

  constructor(
    private fb: FormBuilder,
    private wagerService: WagerService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      opponentId: ['', Validators.required],
      description: ['', Validators.required],
      stakeType: ['PINT', Validators.required],
      stakeAmount: [null],
      stakeDescription: [''],
      wagerType: ['ONCE_OFF', Validators.required],
      gameweek: [null]
    });
  }

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUsername = JSON.parse(storedUser).username;
    }

    this.groupService.getGroup(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.opponents = group.members.filter(m => m.username !== this.currentUsername);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.wagerService.proposeWager({
      ...this.form.value,
      groupId: this.groupId
    }).subscribe({
      next: () => this.router.navigate(['/groups', this.groupId, 'wagers']),
      error: () => {
        this.errorMessage = 'Something went wrong';
        this.loading = false;
      }
    });
  }
}
