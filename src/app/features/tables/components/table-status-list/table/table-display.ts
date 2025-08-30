import { Component, computed, inject, input } from '@angular/core';
import { Table, TableStatus } from '../../../../../shared/models/table.model';
import { TableDisplayService } from '../../../../../core/services/table-display.service';
import { TableIcon } from './table-icon';
import { TableStatusDot } from './table-status-dot';

@Component({
  selector: 'app-table',
  imports: [
    TableIcon,
    TableStatusDot
  ],
  template: `
		<div
				class="group relative table-status-badge rounded-2xl p-5 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-opacity-20"
				[class]="statusColor()"
				[attr.data-testid]="'table-' + table().id + '-status'">

			<app-table-status-dot [dotColor]="getStatusDotColor(table().status)"/>
			<app-table-icon/>

			<div class="space-y-1">
				<div class="text-xl font-bold">{{ table().number }}</div>
				<div class="text-sm font-medium opacity-90">{{ formattedStatus() }}</div>
				<div class="text-xs opacity-70">{{ table().capacity }} seats</div>
			</div>
      
		</div>
  `
})
export class TableDisplay {
  private displayService = inject(TableDisplayService);
  private DOT_COLORS: Record<TableStatus, string> = {
    available: 'bg-green-400',
    occupied: 'bg-red-400',
    cleaning: 'bg-yellow-400',
    reserved: 'bg-blue-400',
  };
  table = input.required<Table>();
  statusColor = computed(() => this.displayService.getStatusColor(this.table().status));
  formattedStatus = computed(() => this.displayService.formatStatus(this.table().status));

  getStatusDotColor(status: TableStatus): string {
    return this.DOT_COLORS[status] || 'bg-gray-400';
  }
}
