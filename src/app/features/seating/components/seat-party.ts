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
import { SubmitButtonComponent } from './submit-button';

@Component({
  selector: 'app-seat-party',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PartySizeInputComponent, TableSelectionComponent, SubmitButtonComponent],
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

							<app-submit-button [disabled]="seatPartyForm.invalid"
																 [isLoading]="isAssigning()"
																 buttonText="Seat Party"
																 loadingText="Seating Party..."
																 (submit)="onAssignTable()"/>
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
