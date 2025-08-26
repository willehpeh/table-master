import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../shared/models/table.model';
import { TableDisplayService } from '../../../core/services/table-display.service';

@Component({
  selector: 'app-table-status-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
      @for (table of tables(); track table.id) {
        <div class="table-status-badge rounded-lg p-4 text-center shadow-md"
             [class]="displayService.getStatusColor(table.status)"
             [attr.data-testid]="'table-' + table.id + '-status'">
          <div class="text-lg font-bold">Table {{ table.number }}</div>
          <div class="text-sm">{{ displayService.formatStatus(table.status) }}</div>
          <div class="text-xs mt-1">{{ table.capacity }} seats</div>
        </div>
      } @empty {
        <div class="col-span-full text-center text-gray-400 py-8" data-testid="no-tables-message">
          No tables available
        </div>
      }
    </div>
  `
})
export class TableStatusListComponent {
  tables = input<Table[]>([]);
  
  protected displayService = inject(TableDisplayService);
}