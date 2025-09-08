import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyTable } from './table/empty-table';
import { TableDisplay } from './table/table-display';
import { TableFacade } from '../../../facades/table.facade';

@Component({
  selector: 'app-table-status-list',
  standalone: true,
  imports: [CommonModule, EmptyTable, TableDisplay],
  template: `
		<div class="px-4 sm:px-6">
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-white mb-2">Restaurant Layout</h2>
				<p class="text-gray-400">Real-time table status overview</p>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
				@for (table of tables(); track table.id) {
					<app-table [table]="table" />
				} @empty {
					<div class="col-span-full text-center py-16">
						<app-empty-table data-testid="no-tables-message"/>
					</div>
				}
			</div>
		</div>
  `
})
export class TableStatusList {
  protected tableFacade = inject(TableFacade);

  protected tables = this.tableFacade.allTables();
}
