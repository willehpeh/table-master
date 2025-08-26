import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStatusListComponent } from './features/tables/components/table-status-list.component';
import { SeatPartyComponent } from './features/seating/components/seat-party.component';
import { TableFacade } from './core/facades/table.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TableStatusListComponent, SeatPartyComponent],
  template: `
    <div class="min-h-screen bg-gray-900 text-white">
      <header class="bg-gray-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-white">TableMaster</h1>
            </div>
            <nav class="flex items-center space-x-4">
              <button (click)="currentView.set('tables')" 
                      [class]="currentView() === 'tables' ? 'bg-blue-600' : 'bg-gray-600'"
                      class="px-4 py-2 rounded-md text-white font-medium transition-colors hover:opacity-90">
                Table Status
              </button>
              <button (click)="currentView.set('seating')"
                      [class]="currentView() === 'seating' ? 'bg-blue-600' : 'bg-gray-600'"
                      class="px-4 py-2 rounded-md text-white font-medium transition-colors hover:opacity-90">
                Seat Party
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="max-w-7xl mx-auto py-6">
        @if (currentView() === 'tables') {
          <app-table-status-list [tables]="tableFacade.allTables()()" />
        } @else if (currentView() === 'seating') {
          <app-seat-party />
        }
      </main>
    </div>
  `
})
export class AppComponent {
  currentView = signal<'tables' | 'seating'>('tables');
  
  protected tableFacade = inject(TableFacade);
}