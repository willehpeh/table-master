import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TableStatus } from '../../shared/models/table.model';
import { inject } from '@angular/core';
import { MockDataRepository } from './mock-data.repository';

function isGetAllTablesRequest(req: HttpRequest<unknown>) {
  return req.method === 'GET' && req.url === '/api/tables';
}

function handleGetAllRequest(repository: MockDataRepository) {
  return of(new HttpResponse({
    status: 200,
    body: repository.find()
  })).pipe(delay(500));
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

function notFound() {
  return of(new HttpResponse({ status: 404 })).pipe(delay(300));
}

function handleUpdateRequest(req: HttpRequest<unknown>, repository: MockDataRepository) {
  const tableId = req.url.split('/')[3];
  const table = repository.findById(tableId);

  if (!table) {
    return notFound();
  }

  const body = req.body as { status: TableStatus };
  repository.updateStatus(tableId, body.status);

  return tableWithUpdates(table);
}

export const mockDataInterceptor: HttpInterceptorFn = (req, next) => {

  const repository = inject(MockDataRepository);

  if (isGetAllTablesRequest(req)) {
    return handleGetAllRequest(repository);
  }

  if (isTableUpdateRequest(req)) {
    return handleUpdateRequest(req, repository);
  }

  return next(req);
};
