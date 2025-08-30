import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './shared/components/app-header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppHeader],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <app-header />
      
      <main class="max-w-7xl mx-auto py-8">
        <div class="transition-all duration-300 ease-in-out">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class App {
}
