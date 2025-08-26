import { Component, inject, input } from '@angular/core';
import { Table } from '../../../shared/models/table.model';
import { TableDisplayService } from '../../../core/services/table-display.service';
import { TableIconComponent } from './table-icon';
import { TableStatusDotComponent } from './table-status-dot';

@Component({
  selector: 'app-table',
  imports: [
    TableIconComponent,
    TableStatusDotComponent
  ],
  template: `
		<div
				class="group relative table-status-badge rounded-2xl p-5 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-opacity-20"
				[class]="displayService.getStatusColor(table().status)"
				[attr.data-testid]="'table-' + table().id + '-status'">

			<app-table-status-dot [dotColor]="getStatusDotColor(table().status)"/>
			<app-table-icon/>

			<div class="space-y-1">
				<div class="text-xl font-bold">{{ table().number }}</div>
				<div class="text-sm font-medium opacity-90">{{ displayService.formatStatus(table().status) }}</div>
				<div class="text-xs opacity-70">{{ table().capacity }} seats</div>
			</div>
      
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
