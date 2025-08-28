import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoAvailableTablesComponent } from './no-available-tables';
import { Table } from '../../../shared/models/table.model';

@Component({
  selector: 'app-table-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NoAvailableTablesComponent],
  template: `
		<div class="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
			<!-- Available Tables Section -->
			<div class="space-y-3">
				<label for="selectedTable" class="flex items-center space-x-2 text-sm font-medium text-gray-300">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd"
									d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clip-rule="evenodd"/>
					</svg>
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

			<!-- Submit Button -->
			<button type="submit"
							[disabled]="formIsInvalid() || isAssigning()"
							data-testid="assign-button"
							(click)="onSubmit()"
							class="relative w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-600/25 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-none">

				@if (isAssigning()) {
					<div class="flex items-center justify-center space-x-3">
						<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
											stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor"
										d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Seating Party...</span>
					</div>
				} @else {
					<div class="flex items-center justify-center space-x-3">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
						</svg>
						<span>Seat Party</span>
					</div>
				}

				<!-- Button glow effect -->
				<div
						class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
			</button>
		</div>
  `
})
export class TableSelectionComponent {
  partySize = input.required<number>();
  availableTables = input.required<Table[]>();
  noTablesAvailable = computed(() => this.availableTables().length === 0);
  selectedTableIdCtrl = input.required<FormControl<string>>();
  formIsInvalid = input.required<boolean>();
  isAssigning = input.required<boolean>();

  submit = output<void>();

  onSubmit(): void {
    this.submit.emit();
  }
}
