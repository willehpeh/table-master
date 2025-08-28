import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
      this.loadTables();
    }

    return this.tablesState.asReadonly();
  }

  availableTablesForPartySize(partySize: number): Signal<Table[]> {
    return computed(() => {
      if (!partySize || partySize <= 0) {
        return [];
      }

      const tables = this.allTables()();
      return tables.filter(table => table.status === 'available' && table.capacity >= partySize);
    });
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<Table> {
    return this.apiService.updateTableStatus(tableId, status).pipe(
      tap(updatedTable => {
        const current = this.tablesState();
        const updated = current.map(t => t.id === tableId ? updatedTable : t);
        this.tablesState.set(updated);
      })
    );
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.apiService.seatPartyAtTable(tableId, partySize).pipe(
      tap(updatedTable => {
        const current = this.tablesState();
        const updated = current.map(t => t.id === tableId ? updatedTable : t);
        this.tablesState.set(updated);
      })
    );
  }

  private loadTables() {
    this.apiService.getTables().pipe(
      tap(tables => {
        this.tablesState.set(tables);
        this.tablesLoaded.set(true);
      }),
      catchError(error => {
        console.error('Failed to load tables:', error);
        return EMPTY;
      })
    ).subscribe();
  }
}
