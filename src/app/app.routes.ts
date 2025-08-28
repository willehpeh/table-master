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
      import('./features/tables/components/table-status-list/table-status-list').then(m => m.TableStatusList)
  },
  {
    path: 'seating',
    loadComponent: () =>
      import('./features/seating/components/seat-party').then(m => m.SeatParty)
  }
];
