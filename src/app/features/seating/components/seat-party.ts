import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableFacade } from '../../../core/facades/table.facade';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { PartySizeInputComponent } from './party-size-input';
import { TableSelectionComponent } from './table-selection';
import { SeatingParty } from './seating-party';

@Component({
  selector: 'app-seat-party',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PartySizeInputComponent, TableSelectionComponent, SeatingParty],
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

						<div class="space-y-3">
							<app-party-size-input [partySizeCtrl]="partySizeCtrl"/>
						</div>

						@if (partySize() && partySize()! > 0) {
							<app-table-selection [partySize]="partySize()!"
																	 [selectedTableIdCtrl]="selectedTableIdCtrl"
																	 [isAssigning]="isAssigning()"/>

							<button type="submit"
											[disabled]="seatPartyForm.invalid || isAssigning()"
											data-testid="assign-button"
											class="relative w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-4 px-6 mt-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-600/25 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-none">

								@if (isAssigning()) {
									<app-seating-party/>
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
						}
					</form>
				</div>
			</div>
		</div>
  `
})
export class SeatParty {
  private tableFacade = inject(TableFacade);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isAssigning = signal(false);
  partySizeCtrl = this.fb.control(null, {
    validators: [Validators.required, Validators.min(1), Validators.max(12)]
  });
  selectedTableIdCtrl = this.fb.control('', { nonNullable: true, validators: [Validators.required] });
  seatPartyForm = this.fb.group({
    partySize: this.partySizeCtrl,
    selectedTableId: this.selectedTableIdCtrl,
  });
  partySize = signal<number | null>(null);

  constructor() {
    this.updatePartySizeSignalOnFormCtrlChange();
  }

  onAssignTable(): void {
    if (!this.seatPartyForm.valid) {
      return;
    }
    this.assignTable(this.selectedTableIdCtrl.value, this.partySizeCtrl.value!);
  }

  private assignTable(selectedTableId: string, partySize: number) {
    this.isAssigning.set(true);
    this.tableFacade.seatPartyAtTable(selectedTableId, partySize).pipe(
      tap(() => {
        this.isAssigning.set(false);
        this.seatPartyForm.reset();
        this.router.navigate(['/tables']);
      }),
      catchError(error => {
        console.error('Failed to seat party:', error);
        this.isAssigning.set(false);
        return EMPTY;
      })
    ).subscribe();
  }

  private updatePartySizeSignalOnFormCtrlChange() {
    this.partySizeCtrl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => this.updatePartySize(value))
    ).subscribe();
  }

  private updatePartySize(value: number | null) {
    const numValue = value ? Number(value) : null;
    this.partySize.set(numValue);
  }
}
