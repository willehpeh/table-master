import { Component } from '@angular/core';
import { NavLink } from './nav-link';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavLink],
  template: `
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
          <nav class="flex items-center gap-2">
            <app-nav-link routerLink="/tables" label="Tables" />
            <app-nav-link routerLink="/seating" label="Seating" />
          </nav>
        </div>
      </div>
    </header>
  `
})
export class AppHeader {
}
