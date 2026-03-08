import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding: 32px">
      <h1>Welcome, {{ (authService.currentUser$ | async)?.username }}!</h1>
      <p>FPL Wager dashboard coming soon.</p>
      <button mat-raised-button color="warn" (click)="authService.logout()">Logout</button>
    </div>
  `
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
}
