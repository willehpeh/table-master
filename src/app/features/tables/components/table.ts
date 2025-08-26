import { Component, inject, input } from '@angular/core';
import { Table } from '../../../shared/models/table.model';
import { TableDisplayService } from '../../../core/services/table-display.service';

@Component({
  selector: 'app-table',
  template: `
		<div
				class="group relative table-status-badge rounded-2xl p-5 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-opacity-20"
				[class]="displayService.getStatusColor(table().status)"
				[attr.data-testid]="'table-' + table().id + '-status'">

			<!-- Status indicator dot -->
			<div class="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse"
					 [class]="getStatusDotColor(table().status)">
			</div>

			<!-- Table icon -->
			<div
					class="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
				<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
					<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
				</svg>
			</div>

			<div class="space-y-1">
				<div class="text-xl font-bold">{{ table().number }}</div>
				<div class="text-sm font-medium opacity-90">{{ displayService.formatStatus(table().status) }}</div>
				<div class="text-xs opacity-70">{{ table().capacity }} seats</div>
			</div>

			<!-- Hover glow effect -->
			<div
					class="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
		</div>
  `
})
export class TableComponent {
  table = input.required<Table>();

  protected displayService = inject(TableDisplayService);

  getStatusDotColor(status: string): string {
    switch (status) {
      case 'available': return 'bg-green-400';
      case 'occupied': return 'bg-red-400';
      case 'cleaning': return 'bg-yellow-400';
      case 'reserved': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  }
}
