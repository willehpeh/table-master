import { Table, TableStatus } from '../models/table.model';
import { Injectable } from '@angular/core';
import { TEST_TABLES } from '../../../test-data/test-tables';

@Injectable({
  providedIn: 'root'
})
export class MockDataRepository {
  find(): Table[] {
    return [...TEST_TABLES];
  }

  findById(id: string): Table | undefined {
    return TEST_TABLES.find(table => table.id === id);
  }

  updateStatus(tableId: string, status: TableStatus): void {
    const table = this.findById(tableId);
    if (table) {
      table.status = status;
    }
  }
}
