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

  afterEach(() => {
    httpCtrl.verify();
  });

});
