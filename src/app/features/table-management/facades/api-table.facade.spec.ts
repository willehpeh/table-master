import { ApiTableFacade } from './api-table.facade';
import { TestBed } from '@angular/core/testing';

describe('ApiTableFacade', () => {
  let facade: ApiTableFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiTableFacade]
    });

    facade = TestBed.inject(ApiTableFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

});
