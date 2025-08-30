import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table, TableStatus } from '../../shared/models/table.model';

@Injectable()
export class TableApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tables';

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${tableId}/status`, { status });
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${tableId}/seat`, {
      status: 'occupied' as TableStatus,
      partySize
    });
  }
}
