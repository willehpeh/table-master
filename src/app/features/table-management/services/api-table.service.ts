import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table, TableStatus } from '../models/table.model';
import { TableService } from './table.service';

@Injectable()
export class ApiTableService implements TableService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tables';

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${tableId}/seat`, {
      status: 'occupied' as TableStatus,
      partySize
    });
  }
}
