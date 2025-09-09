import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockDataInterceptor } from './features/table-management/interceptors/mock-data.interceptor';
import { ApiTableFacade } from './features/table-management/facades/api-table.facade';
import { ApiTableService } from './features/table-management/services/api-table.service';
import { TableDisplayService } from './features/table-management/services/table-display.service';
import { TableService } from './features/table-management/services/table.service';
import { TableFacade } from './features/table-management/facades/table.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([mockDataInterceptor])
    ),
    { provide: TableFacade, useClass: ApiTableFacade },
    { provide: TableService, useClass: ApiTableService },
    TableDisplayService
  ]
};
