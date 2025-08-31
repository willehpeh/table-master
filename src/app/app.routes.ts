import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tables',
    pathMatch: 'full'
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./features/table-management/components/table-overview/table-status-list/table-status-list').then(m => m.TableStatusList)
  },
  {
    path: 'seating',
    loadComponent: () =>
      import('./features/table-management/components/seating/seat-party').then(m => m.SeatParty)
  }
];
