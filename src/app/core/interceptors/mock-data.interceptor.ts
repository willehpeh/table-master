import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Table } from '../../shared/models/table.model';

const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available' },
  { id: '2', number: 2, capacity: 4, status: 'occupied' },
  { id: '3', number: 3, capacity: 6, status: 'available' },
  { id: '4', number: 4, capacity: 4, status: 'cleaning' },
  { id: '5', number: 5, capacity: 2, status: 'reserved' },
  { id: '6', number: 6, capacity: 8, status: 'available' },
  { id: '7', number: 7, capacity: 4, status: 'available' },
  { id: '8', number: 8, capacity: 2, status: 'occupied' }
];

export const mockDataInterceptor: HttpInterceptorFn = (req, next) => {
  // Handle GET /api/tables
  if (req.method === 'GET' && req.url === '/api/tables') {
    return of(new HttpResponse({
      status: 200,
      body: [...mockTables]
    })).pipe(delay(500));
  }

  // Handle PATCH /api/tables/:id/status and /api/tables/:id/seat
  if (req.method === 'PATCH' && req.url.startsWith('/api/tables/')) {
    const segments = req.url.split('/');
    const tableId = segments[3];
    const table = mockTables.find(t => t.id === tableId);
    
    if (table) {
      const updatedTable = { ...table };
      
      if (segments[4] === 'status' && req.body) {
        const body = req.body as { status: Table['status'] };
        updatedTable.status = body.status;
      } else if (segments[4] === 'seat' && req.body) {
        const body = req.body as { status: Table['status'] };
        updatedTable.status = body.status;
      }
      
      // Update the mock data
      const index = mockTables.findIndex(t => t.id === tableId);
      if (index !== -1) {
        mockTables[index] = updatedTable;
      }
      
      return of(new HttpResponse({
        status: 200,
        body: updatedTable
      })).pipe(delay(300));
    }
  }

  return next(req);
};