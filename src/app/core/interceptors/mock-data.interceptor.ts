import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Table, TableStatus } from '../../shared/models/table.model';

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

function isGetAllTablesRequest(req: HttpRequest<unknown>) {
  return req.method === 'GET' && req.url === '/api/tables';
}

function dummyTables() {
  return of(new HttpResponse({
    status: 200,
    body: [...mockTables]
  })).pipe(delay(500));
}

function isStatusUpdate(req: HttpRequest<unknown>) {
  const segments = req.url.split('/');
  return segments[4] === 'status' && req.body;
}

function updateStatus(req: HttpRequest<unknown>, updatedTable: {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus
}) {
  const body = req.body as { status: Table['status'] };
  updatedTable.status = body.status;
}

function isSeatUpdate(req: HttpRequest<unknown>) {
  const segments = req.url.split('/');
  return segments[4] === 'seat' && req.body;
}

function updateSeating(req: HttpRequest<unknown>, updatedTable: {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus
}) {
  const body = req.body as { status: Table['status'] };
  updatedTable.status = body.status;
}

function persistTable(tableId: string, updatedTable: {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus
}) {
  const index = mockTables.findIndex(t => t.id === tableId);
  if (index !== -1) {
    mockTables[index] = updatedTable;
  }
}

function tableWithUpdates(updatedTable: { id: string; number: number; capacity: number; status: TableStatus }) {
  return of(new HttpResponse({
    status: 200,
    body: updatedTable
  })).pipe(delay(300));
}

function isTableUpdateRequest(req: HttpRequest<unknown>) {
  return req.method === 'PATCH' && req.url.startsWith('/api/tables/');
}

function findTable(req: HttpRequest<unknown>) {
  const segments = req.url.split('/');
  const tableId = segments[3];
  const table = mockTables.find(t => t.id === tableId);
  return { tableId, table };
}

function notFound() {
  return of(new HttpResponse({ status: 404 })).pipe(delay(300));
}

export const mockDataInterceptor: HttpInterceptorFn = (req, next) => {
  if (isGetAllTablesRequest(req)) {
    return dummyTables();
  }

  if (isTableUpdateRequest(req)) {
    const { tableId, table } = findTable(req);

    if (!table) {
      return notFound();
    }

    const updatedTable = { ...table };

    if (isStatusUpdate(req)) {
      updateStatus(req, updatedTable);
    }

    if (isSeatUpdate(req)) {
      updateSeating(req, updatedTable);
    }

    persistTable(tableId, updatedTable);

    return tableWithUpdates(updatedTable);
  }

  return next(req);
};
