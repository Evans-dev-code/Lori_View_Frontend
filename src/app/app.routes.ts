import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trucks',
    loadChildren: () =>
      import('./features/trucks/trucks.module')
        .then(m => m.TrucksModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',
    loadChildren: () =>
      import('./features/trips/trips.module')
        .then(m => m.TripsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fuel',
    loadChildren: () =>
      import('./features/fuel/fuel.module')
        .then(m => m.FuelModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts',
    loadChildren: () =>
      import('./features/alerts/alerts.module')
        .then(m => m.AlertsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    loadChildren: () =>
      import('./features/subscription/subscription.module')
        .then(m => m.SubscriptionModule),
    canActivate: [AuthGuard]
  },
  {
  path: 'profile',
  loadChildren: () =>
    import('./features/profile/profile.module')
      .then(m => m.ProfileModule),
  canActivate: [AuthGuard]
},
  {
  path: 'admin',
  loadChildren: () =>
    import('./features/admin/admin.module')
      .then(m => m.AdminModule),
  canActivate: [AuthGuard]
},
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];