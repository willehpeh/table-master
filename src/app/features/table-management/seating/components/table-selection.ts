import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoAvailableTables } from './no-available-tables';
import { AvailableTablesIcon } from './available-tables-icon';
import { TableFacade } from '../../facades/table.facade';

@Component({
  selector: 'app-table-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NoAvailableTables, AvailableTablesIcon],
  template: `
		<div class="space-y-6 animate-in slide-in-from-bottom-4 duration-300 mb-6">
			<div class="space-y-3">
				<label for="selectedTable" class="flex items-center space-x-2 text-sm font-medium text-gray-300">
					<app-available-tables-icon/>
					<span>Available Tables</span>
				</label>

				@if (noTablesAvailable()) {
					<app-no-available-tables [partySize]="partySize()"/>
				} @else {
					<div class="relative">
						<select id="selectedTable"
										[formControl]="selectedTableIdCtrl()"
										data-testid="table-select"
										class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer">
							<option value="">Choose a table...</option>
							@for (table of availableTables(); track table.id) {
								<option [value]="table.id">
									Table {{ table.number }} ({{ table.capacity }} seats)
								</option>
							}
						</select>
						<div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
							<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
							</svg>
						</div>
					</div>
				}
			</div>
		</div>
  `
})
export class TableSelection {
  private tableFacade = inject(TableFacade);

  partySize = input.required<number>();
  selectedTableIdCtrl = input.required<FormControl<string>>();
  isAssigning = input(false);

  availableTables = computed(() => {
    return this.tableFacade.availableTablesForPartySize(this.partySize())();
  });

  noTablesAvailable = computed(() => this.availableTables().length === 0);
}
