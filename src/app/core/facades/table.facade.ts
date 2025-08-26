import { Injectable, inject, signal, Signal } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TableApiService } from '../services/table-api.service';
import { Table, TableStatus } from '../../shared/models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableFacade {
  private apiService = inject(TableApiService);
  
  private tablesState = signal<Table[]>([]);
  private tablesLoaded = signal<boolean>(false);

  allTables(): Signal<Table[]> {
    if (!this.tablesLoaded()) {
      this.apiService.getTables()
        .pipe(
          tap(tables => {
            this.tablesState.set(tables);
            this.tablesLoaded.set(true);
          }),
          catchError(error => {
            console.error('Failed to load tables:', error);
            return EMPTY;
          })
        )
        .subscribe();
    }
    
    return this.tablesState.asReadonly();
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<Table> {
    return this.apiService.updateTableStatus(tableId, status)
      .pipe(
        tap(updatedTable => {
          const current = this.tablesState();
          const updated = current.map(t => t.id === tableId ? updatedTable : t);
          this.tablesState.set(updated);
        })
      );
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.apiService.seatPartyAtTable(tableId, partySize)
      .pipe(
        tap(updatedTable => {
          const current = this.tablesState();
          const updated = current.map(t => t.id === tableId ? updatedTable : t);
          this.tablesState.set(updated);
        })
      );
  }
}