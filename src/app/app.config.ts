import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockDataInterceptor } from './features/table-management/interceptors/mock-data.interceptor';
import { TableFacade } from './features/table-management/facades/table.facade';
import { TableApiService } from './features/table-management/services/table-api.service';
import { TableDisplayService } from './features/table-management/services/table-display.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([mockDataInterceptor])
    ),
    TableFacade,
    TableApiService,
    TableDisplayService
  ]
};
