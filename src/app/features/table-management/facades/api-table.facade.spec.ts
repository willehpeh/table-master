import { ApiTableFacade } from './api-table.facade';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TableService } from '../services/table.service';
import { ApiTableService } from '../services/api-table.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TEST_TABLES } from '../../../test-data/test-tables';

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

  afterEach(() => {
    httpCtrl.verify();
  });

});
