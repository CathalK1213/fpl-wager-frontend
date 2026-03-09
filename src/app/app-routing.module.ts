import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/create',
    loadComponent: () => import('./features/groups/create-group/create-group.component').then(m => m.CreateGroupComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/join',
    loadComponent: () => import('./features/groups/join-group/join-group.component').then(m => m.JoinGroupComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id/leaderboard',
    loadComponent: () => import('./features/groups/group-leaderboard/group-leaderboard.component').then(m => m.GroupLeaderboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id',
    loadComponent: () => import('./features/groups/group-dashboard/group-dashboard.component').then(m => m.GroupDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id/wagers',
    loadComponent: () => import('./features/wagers/wager-list/wager-list.component').then(m => m.WagerListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id/wagers/propose',
    loadComponent: () => import('./features/wagers/propose-wager/propose-wager.component').then(m => m.ProposeWagerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id/debts',
    loadComponent: () => import('./features/wagers/debt-tracker/debt-tracker.component').then(m => m.DebtTrackerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'groups/:id/trash-talk/:gameweek',
    loadComponent: () => import('./features/groups/trash-talk/trash-talk.component').then(m => m.TrashTalkComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
