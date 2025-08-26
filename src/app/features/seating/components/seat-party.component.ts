import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableFacade } from '../../../core/facades/table.facade';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-seat-party',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg m-4">
      <h3 class="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Seat New Party</h3>
      
      <form [formGroup]="seatPartyForm" (ngSubmit)="onAssignTable()" class="space-y-4">
        <div>
          <label for="partySize" class="block text-sm font-medium text-gray-300 mb-2">
            Party Size:
          </label>
          <input type="number" 
                 id="partySize"
                 formControlName="partySize"
                 min="1" 
                 max="12"
                 data-testid="party-size-input"
                 class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <!-- Debug info for development -->
        <div class="text-xs text-gray-400 mt-2">
          Debug: Party size = {{ partySize() }}, Available tables = {{ availableTables().length }}
        </div>
        
        @if (partySize() && partySize()! > 0) {
          <div class="space-y-4">
            <div>
              <label for="selectedTable" class="block text-sm font-medium text-gray-300 mb-2">
                Available Tables:
              </label>
              
              @if (availableTables().length === 0) {
                <div class="text-yellow-400 text-sm py-2" data-testid="no-available-tables">
                  No tables available for party of {{ partySize() }}
                </div>
              } @else {
                <select id="selectedTable" 
                        formControlName="selectedTableId"
                        data-testid="table-select"
                        class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a table...</option>
                  @for (table of availableTables(); track table.id) {
                    <option [value]="table.id">
                      Table {{ table.number }} ({{ table.capacity }} seats)
                    </option>
                  }
                </select>
              }
            </div>
            
            <button type="submit" 
                    [disabled]="seatPartyForm.invalid || isAssigning()"
                    data-testid="assign-button"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition-colors touch-manipulation">
              {{ isAssigning() ? 'Assigning...' : 'Seat Party' }}
            </button>
          </div>
        }
      </form>
    </div>
  `
})
export class SeatPartyComponent {
  private tableFacade = inject(TableFacade);
  private fb = inject(FormBuilder);
  
  seatPartyForm = this.fb.group({
    partySize: [null as number | null, [Validators.required, Validators.min(1), Validators.max(12)]],
    selectedTableId: ['', Validators.required]
  });
  
  // Use a signal to track party size that updates when form changes
  private partySizeSignal = signal<number | null>(null);
  
  constructor() {
    // Subscribe to form changes and update signal
    this.seatPartyForm.get('partySize')?.valueChanges.subscribe(value => {
      const numValue = value ? Number(value) : null;
      this.partySizeSignal.set(numValue);
    });
  }
  
  partySize = computed(() => this.partySizeSignal());
  
  availableTables = computed(() => {
    const size = this.partySize();
    if (!size || size <= 0) return [];
    
    const tables = this.tableFacade.allTables()();
    return tables.filter(table => table.status === 'available' && table.capacity >= size);
  });
  
  isAssigning = signal(false);
  
  onAssignTable(): void {
    if (this.seatPartyForm.valid) {
      const { partySize, selectedTableId } = this.seatPartyForm.value;
      this.isAssigning.set(true);
      
      this.tableFacade.seatPartyAtTable(selectedTableId!, partySize!)
        .pipe(
          finalize(() => this.isAssigning.set(false))
        )
        .subscribe({
          next: () => this.seatPartyForm.reset(),
          error: (error) => console.error('Failed to seat party:', error)
        });
    }
  }
}