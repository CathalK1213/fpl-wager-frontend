import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { ShellComponent } from './core/shell/shell.component';

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
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'groups/create',
        loadComponent: () => import('./features/groups/create-group/create-group.component').then(m => m.CreateGroupComponent)
      },
      {
        path: 'groups/join',
        loadComponent: () => import('./features/groups/join-group/join-group.component').then(m => m.JoinGroupComponent)
      },
      {
        path: 'groups/:id',
        loadComponent: () => import('./features/groups/group-dashboard/group-dashboard.component').then(m => m.GroupDashboardComponent)
      },
      {
        path: 'groups/:id/leaderboard',
        loadComponent: () => import('./features/groups/group-leaderboard/group-leaderboard.component').then(m => m.GroupLeaderboardComponent)
      },
      {
        path: 'groups/:id/wagers',
        loadComponent: () => import('./features/wagers/wager-list/wager-list.component').then(m => m.WagerListComponent)
      },
      {
        path: 'groups/:id/wagers/propose',
        loadComponent: () => import('./features/wagers/propose-wager/propose-wager.component').then(m => m.ProposeWagerComponent)
      },
      {
        path: 'groups/:id/debts',
        loadComponent: () => import('./features/wagers/debt-tracker/debt-tracker.component').then(m => m.DebtTrackerComponent)
      },
      {
        path: 'groups/:id/trash-talk/:gameweek',
        loadComponent: () => import('./features/groups/trash-talk/trash-talk.component').then(m => m.TrashTalkComponent)
      },
      {
        path: 'groups/:id/wrapped',
        loadComponent: () => import('./features/groups/season-wrapped/season-wrapped.component').then(m => m.SeasonWrappedComponent)
      },
      {
        path: 'groups/:id/wagers/:wagerId/chat',
        loadComponent: () => import('./features/wagers/wager-chat/wager-chat.component')
          .then(m => m.WagerChatComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
