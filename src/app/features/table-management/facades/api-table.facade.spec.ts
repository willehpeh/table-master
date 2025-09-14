import { ApiTableFacade } from './api-table.facade';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TableService } from '../services/table.service';
import { ApiTableService } from '../services/api-table.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TEST_TABLES } from '../../../test-data/test-tables';
import { Table } from '../models/table.model';

describe('ApiTableFacade', () => {
  let facade: ApiTableFacade;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiTableFacade,
        provideZonelessChangeDetection(),
        { provide: TableService, useClass: ApiTableService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    facade = TestBed.inject(ApiTableFacade);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load all tables if they are not already loaded', () => {
    const tables = facade.allTables();
    const req = httpCtrl.expectOne('/api/tables');
    req.flush(TEST_TABLES);

    expect(tables()).toEqual(TEST_TABLES);
  });

  describe('Available tables', () => {

    it('should show no tables available for a negative party size', () => {
      const tables = facade.availableTablesForPartySize(-1);
      expect(tables()).toEqual([]);
    });

    it('should show no tables available for a party size of 0', () => {
      const tables = facade.availableTablesForPartySize(0);
      expect(tables()).toEqual([]);
    });

    it('should show all available tables with sufficient capacity', () => {
      const partySize = 5;
      const tables = facade.availableTablesForPartySize(partySize);
      const req = httpCtrl.expectOne('/api/tables');
      req.flush(TEST_TABLES);
      const expected = TEST_TABLES.filter(table => table.capacity >= partySize && table.status === 'available');
      expect(tables()).toEqual(expected);
    });

  });

  describe('Seat party at table', () => {

    it('should update the table on the server', () => {
      const tableId = 'table1';
      const partySize = 5;
      facade.seatPartyAtTable(tableId, partySize).subscribe();
      const req = httpCtrl.expectOne(`/api/tables/${ tableId }/seat`);
      expect(req.request.body).toEqual({ status: 'occupied', partySize});
    });

    it('should mark the table as occupied', () => {
      const table: Table = { id: 'table1', status: 'available', capacity: 6, number: 1 };
      const tables = facade.allTables();
      const req = httpCtrl.expectOne(`/api/tables`);
      req.flush([table]);
      facade.seatPartyAtTable(table.id, table.capacity).subscribe();
      const occupiedTable: Table = { ...table, status: 'occupied' };
      httpCtrl.expectOne(`/api/tables/${ table.id }/seat`).flush(occupiedTable);
      expect(tables()).toEqual([occupiedTable]);
    });

    it('should mark the table as occupied (REFACTORED)', () => {
      const table: Table = { id: 'table1', status: 'available', capacity: 6, number: 1 };
      const tables = allTablesFlushedWith(table);
      facade.seatPartyAtTable(table.id, table.capacity).subscribe();
      const occupiedTable: Table = { ...table, status: 'occupied' };
      httpCtrl.expectOne(`/api/tables/${ table.id }/seat`).flush(occupiedTable);
      expect(tables()).toEqual([occupiedTable]);
    });

    function allTablesFlushedWith(table: Table) {
      const tables = facade.allTables();
      const req = httpCtrl.expectOne(`/api/tables`);
      req.flush([table]);
      return tables;
    }

  });

  afterEach(() => {
    httpCtrl.verify();
  });

});
