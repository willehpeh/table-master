import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStatusList } from './features/tables/components/table-status-list/table-status-list';
import { SeatPartyComponent } from './features/seating/components/seat-party.component';
import { TableFacade } from './core/facades/table.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TableStatusList, SeatPartyComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <header class="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20">
            <div class="flex items-center">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span class="text-xl font-bold">T</span>
                </div>
                <h1 class="hidden sm:block text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  TableMaster
                </h1>
              </div>
            </div>
            <nav class="flex items-center space-x-2">
              <button (click)="currentView.set('tables')" 
                      [class]="currentView() === 'tables' ? 'bg-blue-600/90 shadow-lg shadow-blue-600/25' : 'bg-gray-700/50 hover:bg-gray-600/50'"
                      class="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 backdrop-blur-sm">
                <span class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full" [class]="currentView() === 'tables' ? 'bg-blue-300' : 'bg-gray-400'"></span>
                  <span>Tables</span>
                </span>
              </button>
              <button (click)="currentView.set('seating')"
                      [class]="currentView() === 'seating' ? 'bg-blue-600/90 shadow-lg shadow-blue-600/25' : 'bg-gray-700/50 hover:bg-gray-600/50'"
                      class="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 backdrop-blur-sm">
                <span class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full" [class]="currentView() === 'seating' ? 'bg-blue-300' : 'bg-gray-400'"></span>
                  <span>Seating</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="max-w-7xl mx-auto py-8">
        <div class="transition-all duration-300 ease-in-out">
          @if (currentView() === 'tables') {
            <app-table-status-list [tables]="tableFacade.allTables()()" />
          } @else if (currentView() === 'seating') {
            <app-seat-party (partySeated)="onPartySeated()" />
          }
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  currentView = signal<'tables' | 'seating'>('tables');

  protected tableFacade = inject(TableFacade);

  onPartySeated(): void {
    // Redirect to tables page after successfully seating a party
    this.currentView.set('tables');
  }
}
