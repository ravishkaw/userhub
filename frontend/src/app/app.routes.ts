import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((module) => module.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((module) => module.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then((module) => module.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (module) => module.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (module) => module.ProfileComponent
          ),
      },
      {
        path: 'manage-users',
        loadComponent: () =>
          import('./components/user/manageuser.component').then((module) => module.ManageUsers),
        canActivate: [adminGuard],
      },
      {
        path: 'add-user',
        loadComponent: () =>
          import('./components/user/add-user.component').then((module) => module.AddUserComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'edit-user/:id',
        loadComponent: () =>
          import('./components/user/edit-user.component').then(
            (module) => module.EditUserComponent
          ),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
