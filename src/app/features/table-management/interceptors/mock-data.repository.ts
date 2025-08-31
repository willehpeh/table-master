import { Table, TableStatus } from '../models/table.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataRepository {
  private mockTables: Table[] = [
    { id: '1', number: 1, capacity: 2, status: 'available' },
    { id: '2', number: 2, capacity: 4, status: 'occupied' },
    { id: '3', number: 3, capacity: 6, status: 'available' },
    { id: '4', number: 4, capacity: 4, status: 'cleaning' },
    { id: '5', number: 5, capacity: 2, status: 'reserved' },
    { id: '6', number: 6, capacity: 8, status: 'available' },
    { id: '7', number: 7, capacity: 4, status: 'available' },
    { id: '8', number: 8, capacity: 2, status: 'occupied' }
  ];

  find(): Table[] {
    return [...this.mockTables];
  }

  findById(id: string): Table | undefined {
    return this.mockTables.find(table => table.id === id);
  }

  updateStatus(tableId: string, status: TableStatus): void {
    const table = this.findById(tableId);
    if (table) {
      table.status = status;
    }
  }
}
