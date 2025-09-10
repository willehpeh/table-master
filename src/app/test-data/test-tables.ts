import { Table } from '../features/table-management/models/table.model';

export const TEST_TABLES: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available' },
  { id: '2', number: 2, capacity: 4, status: 'occupied' },
  { id: '3', number: 3, capacity: 6, status: 'available' },
  { id: '4', number: 4, capacity: 4, status: 'cleaning' },
  { id: '5', number: 5, capacity: 2, status: 'reserved' },
  { id: '6', number: 6, capacity: 8, status: 'available' },
  { id: '7', number: 7, capacity: 4, status: 'available' },
  { id: '8', number: 8, capacity: 2, status: 'occupied' }
];
