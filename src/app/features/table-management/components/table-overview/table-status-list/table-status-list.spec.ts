import { TableStatusList } from './table-status-list';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, provideZonelessChangeDetection, signal } from '@angular/core';
import { TableFacade } from '../../../facades/table.facade';
import { By } from '@angular/platform-browser';
import { TEST_TABLES } from '../../../../../test-data/test-tables';
import { TableDisplayService } from '../../../services/table-display.service';

describe('TableStatusList', () => {

  let fixture: ComponentFixture<TableStatusList>;
  let component: TableStatusList;
  let debugElement: DebugElement;

  describe('When there are no tables', () => {

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [TableStatusList],
        providers: [
          provideZonelessChangeDetection(),
          { provide: TableFacade, useValue: { allTables: () => signal([]) } }
        ]
      });

      fixture = TestBed.createComponent(TableStatusList);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a "no tables" message when there are no tables', () => {
      const noTablesMessage = debugElement.query(By.css('[data-testid="no-tables-message"]'));
      expect(noTablesMessage).toBeTruthy();
    });

  });

  describe('When there are tables', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [TableStatusList],
        providers: [
          provideZonelessChangeDetection(),
          { provide: TableFacade, useValue: { allTables: () => signal(TEST_TABLES) } },
          TableDisplayService
        ]
      });

      fixture = TestBed.createComponent(TableStatusList);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the right number of tables', () => {
      const tableElements = debugElement.queryAll(By.css('[data-testid="table"]'));
      expect(tableElements.length).toBe(TEST_TABLES.length);
    });

    it('should display the right capacity for each table', () => {
      const capacityElements = debugElement.queryAll(By.css('[data-testid="table-capacity"]'));
      const capacityTextValues = capacityElements.map(element => element.nativeElement.textContent);
      const expectedTextValues = TEST_TABLES.map(table => `${table.capacity} seats`);
      expect(capacityTextValues).toEqual(expectedTextValues);
    });

    it('should display the correct table number for each table', () => {
      const numberElements = debugElement.queryAll(By.css('[data-testid="table-number"]'));
      const numberTextValues = numberElements.map(element => element.nativeElement.textContent);
      const expectedTextValues = TEST_TABLES.map(table => `${table.number}`);
      expect(numberTextValues).toEqual(expectedTextValues);
    });

  });

});
