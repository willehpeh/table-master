import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  host: {
    'style': 'display: contents'
  },
  template: `
    <a [routerLink]="routerLink()" 
       routerLinkActive="!bg-blue-600/90 !shadow-lg !shadow-blue-600/25 [&_.indicator]:!bg-blue-300"
       class="bg-gray-700/50 hover:bg-gray-600/50 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 backdrop-blur-sm">
      <span class="flex items-center space-x-2">
        <span class="indicator w-2 h-2 rounded-full bg-gray-400"></span>
        <span>{{ label() }}</span>
      </span>
    </a>
  `
})
export class NavLink {
  routerLink = input.required<string>();
  label = input.required<string>();
}
