import { Signal } from '@angular/core';
import { Table } from '../models/table.model';
import { Observable } from 'rxjs';

export abstract class TableFacade {
  abstract allTables(): Signal<Table[]>;
  abstract availableTablesForPartySize(partySize: number): Signal<Table[]>;
  abstract seatPartyAtTable(tableId: string, partySize: number): Observable<Table>;
}
