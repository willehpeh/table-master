import { Observable } from 'rxjs';
import { Table } from '../models/table.model';

export abstract class TableService {
  abstract getTables(): Observable<Table[]>;
  abstract seatPartyAtTable(tableId: string, partySize: number): Observable<Table>;
}
