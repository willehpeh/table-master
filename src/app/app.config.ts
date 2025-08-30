import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockDataInterceptor } from './core/interceptors/mock-data.interceptor';
import { TableFacade } from './core/facades/table.facade';
import { TableApiService } from './core/services/table-api.service';
import { TableDisplayService } from './core/services/table-display.service';

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
