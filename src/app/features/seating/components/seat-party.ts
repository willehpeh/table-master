import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableFacade } from '../../../core/facades/table.facade';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NoAvailableTablesComponent } from './no-available-tables';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-seat-party',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NoAvailableTablesComponent],
  template: `
		<div class="px-4 sm:px-6">
			<div class="max-w-lg mx-auto">
				<div class="mb-8 text-center">
					<h2 class="text-2xl font-bold text-white mb-2">Seat New Party</h2>
					<p class="text-gray-400">Find the perfect table for your guests</p>
				</div>

				<div
						class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-700/30">
					<form [formGroup]="seatPartyForm" (ngSubmit)="onAssignTable()" class="space-y-6">

						<!-- Party Size Input -->
						<div class="space-y-3">
							<label for="partySize" class="flex items-center space-x-2 text-sm font-medium text-gray-300">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<span>Party Size</span>
							</label>
							<div class="relative">
								<input type="number"
											 id="partySize"
											 formControlName="partySize"
											 min="1"
											 max="12"
											 data-testid="party-size-input"
											 placeholder="How many guests?"
											 class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm">
								<div class="absolute inset-y-0 right-0 flex items-center pr-4">
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
													d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
									</svg>
								</div>
							</div>
						</div>

						<!-- Table Selection (shown when party size > 0) -->
						@if (partySize() && partySize()! > 0) {
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
										<app-no-available-tables [partySize]="partySize()!"/>
									} @else {
										<div class="relative">
											<select id="selectedTable"
															formControlName="selectedTableId"
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
												[disabled]="seatPartyForm.invalid || isAssigning()"
												data-testid="assign-button"
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
						}
					</form>
				</div>
			</div>
		</div>
  `
})
export class SeatParty {
  isAssigning = signal(false);
  // Output event to notify parent component when party is seated
  partySeated = output<void>();
  private tableFacade = inject(TableFacade);
  private fb = inject(FormBuilder);
  partySizeCtrl = this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(12)]);
  seatPartyForm = this.fb.group({
    partySize: this.partySizeCtrl,
    selectedTableId: ['', Validators.required]
  });
  private partySizeSignal = signal<number | null>(null);
  partySize = computed(() => this.partySizeSignal());
  availableTables = computed(() => {
    const size = this.partySize();
    if (!size || size <= 0) {
      return [];
    }

    const tables = this.tableFacade.allTables()();
    return tables.filter(table => table.status === 'available' && table.capacity >= size);
  });
  noTablesAvailable = computed(() => this.availableTables().length === 0);

  constructor() {
    this.updatePartySizeSignalOnFormCtrlChange();
  }

  onAssignTable(): void {
    if (!this.seatPartyForm.valid) {
      return;
    }
    const { partySize, selectedTableId } = this.seatPartyForm.value;
    this.isAssigning.set(true);

    this.assignTable(selectedTableId!, partySize!);
  }

  private assignTable(selectedTableId: string, partySize: number) {
    this.tableFacade.seatPartyAtTable(selectedTableId, partySize)
      .pipe(
        tap(() => {
          this.isAssigning.set(false);
          this.seatPartyForm.reset();
          this.partySeated.emit();
        }),
        catchError(error => {
          console.error('Failed to seat party:', error);
          return EMPTY;
        })
      ).subscribe();
  }

  private updatePartySizeSignalOnFormCtrlChange() {
    this.partySizeCtrl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => {
        const numValue = value ? Number(value) : null;
        this.partySizeSignal.set(numValue);
      })
    ).subscribe();
  }
}
