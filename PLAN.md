# TableMaster Sample App - Build Plan

## Project Overview

Build a minimal but realistic Angular restaurant management application focused on table management. This app serves as a sample application for an Angular unit testing course.

## Tech Stack & Requirements

- **Angular 20** with latest features
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Modern Angular patterns**: signals, control flow, inject() function
- **Clean architecture**: separation between components and business logic
- **Dark theme** with sleek, modern UI design

## Architecture Requirements

### Clean Architecture Principles

1. **Components** should only handle UI logic and user interactions
1. **Facades** provide signals to components and handle state management
1. **Services** handle API calls and return Observables
1. **No business logic in components** - all logic in facades/services
1. **Test boundaries**: Components test against fake facades, Services test with real HTTP

### Modern Angular Patterns

- Use `inject()` function instead of constructor injection
- Use signals for all reactive state
- Use `@for`, `@if`, `@else` control flow instead of structural directives
- Use `input()` and `input.required()` for component inputs
- Use `computed()` for derived state
- Use pipeable RxJS operators, no callback-style subscribe

## Features to Implement

### 1. Core Models & Types

```typescript
// src/app/shared/models/table.model.ts
export type TableStatus = 'available' | 'occupied' | 'cleaning' | 'reserved';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
}

export interface WaitlistCustomer {
  id: string;
  name: string;
  partySize: number;
  waitingSince: Date;
}
```

### 2. Table Display Service (Chapter 2)

**File**: `src/app/core/services/table-display.service.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class TableDisplayService {
  formatStatus(status: TableStatus): string {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'cleaning': return 'Being Cleaned';
      case 'reserved': return 'Reserved';
      default: return 'Unknown';
    }
  }
  
  getStatusColor(status: TableStatus): string {
    switch (status) {
      case 'available': return 'bg-green-500 text-white';
      case 'occupied': return 'bg-red-500 text-white';
      case 'cleaning': return 'bg-yellow-500 text-black';
      case 'reserved': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}
```

### 3. Table Status List Component (Chapter 3)

**File**: `src/app/features/tables/components/table-status-list.component.ts`

```typescript
@Component({
  selector: 'app-table-status-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
      @for (table of tables(); track table.id) {
        <div class="table-status-badge rounded-lg p-4 text-center shadow-lg"
             [class]="displayService.getStatusColor(table.status)"
             [attr.data-testid]="'table-' + table.id + '-status'">
          <div class="text-lg font-bold">Table {{ table.number }}</div>
          <div class="text-sm">{{ displayService.formatStatus(table.status) }}</div>
          <div class="text-xs mt-1">{{ table.capacity }} seats</div>
        </div>
      } @empty {
        <div class="col-span-full text-center text-gray-400 py-8" data-testid="no-tables-message">
          No tables available
        </div>
      }
    </div>
  `
})
export class TableStatusListComponent {
  tables = input<Table[]>([]);
  
  protected displayService = inject(TableDisplayService);
}
```

### 4. Table API Service (Chapter 4)

**File**: `src/app/core/services/table-api.service.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class TableApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tables';

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${tableId}/status`, { status });
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.http.patch<Table>(`${this.apiUrl}/${tableId}/seat`, { 
      status: 'occupied', 
      partySize 
    });
  }
}
```

### 5. Table Facade (Chapter 4)

**File**: `src/app/core/facades/table.facade.ts`

```typescript
@Injectable({
  providedIn: 'root'
})
export class TableFacade {
  private apiService = inject(TableApiService);
  
  private tablesState = signal<Table[]>([]);
  private tablesLoaded = signal<boolean>(false);

  allTables(): Signal<Table[]> {
    if (!this.tablesLoaded()) {
      this.apiService.getTables()
        .pipe(
          tap(tables => {
            this.tablesState.set(tables);
            this.tablesLoaded.set(true);
          }),
          catchError(error => {
            console.error('Failed to load tables:', error);
            return EMPTY;
          })
        )
        .subscribe();
    }
    
    return this.tablesState.asReadonly();
  }

  updateTableStatus(tableId: string, status: TableStatus): Observable<Table> {
    return this.apiService.updateTableStatus(tableId, status)
      .pipe(
        tap(updatedTable => {
          const current = this.tablesState();
          const updated = current.map(t => t.id === tableId ? updatedTable : t);
          this.tablesState.set(updated);
        })
      );
  }

  seatPartyAtTable(tableId: string, partySize: number): Observable<Table> {
    return this.apiService.seatPartyAtTable(tableId, partySize)
      .pipe(
        tap(updatedTable => {
          const current = this.tablesState();
          const updated = current.map(t => t.id === tableId ? updatedTable : t);
          this.tablesState.set(updated);
        })
      );
  }
}
```

### 6. Seat Party Component (Chapter 5)

**File**: `src/app/features/seating/components/seat-party.component.ts`

```typescript
@Component({
  selector: 'app-seat-party',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
      <h3 class="text-xl font-bold text-white mb-6">Seat New Party</h3>
      
      <form [formGroup]="seatPartyForm" (ngSubmit)="onAssignTable()" class="space-y-4">
        <div>
          <label for="partySize" class="block text-sm font-medium text-gray-300 mb-2">
            Party Size:
          </label>
          <input type="number" 
                 id="partySize"
                 formControlName="partySize"
                 min="1" 
                 max="12"
                 data-testid="party-size-input"
                 class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        @if (partySize() && partySize()! > 0) {
          <div>
            <label for="selectedTable" class="block text-sm font-medium text-gray-300 mb-2">
              Available Tables:
            </label>
            
            @if (availableTables().length === 0) {
              <div class="text-yellow-400 text-sm py-2" data-testid="no-available-tables">
                No tables available for party of {{ partySize() }}
              </div>
            } @else {
              <select id="selectedTable" 
                      formControlName="selectedTableId"
                      data-testid="table-select"
                      class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Choose a table...</option>
                @for (table of availableTables(); track table.id) {
                  <option [value]="table.id">
                    Table {{ table.number }} ({{ table.capacity }} seats)
                  </option>
                }
              </select>
            }
          </div>
          
          <button type="submit" 
                  [disabled]="seatPartyForm.invalid || isAssigning()"
                  data-testid="assign-button"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            {{ isAssigning() ? 'Assigning...' : 'Seat Party' }}
          </button>
        }
      </form>
    </div>
  `
})
export class SeatPartyComponent {
  private tableFacade = inject(TableFacade);
  private fb = inject(FormBuilder);
  
  seatPartyForm = this.fb.group({
    partySize: [null as number | null, [Validators.required, Validators.min(1), Validators.max(12)]],
    selectedTableId: ['', Validators.required]
  });
  
  partySize = computed(() => this.seatPartyForm.value.partySize);
  
  availableTables = computed(() => {
    const size = this.partySize();
    if (!size || size <= 0) return [];
    
    return this.tableFacade.allTables()
      .filter(table => table.status === 'available' && table.capacity >= size);
  });
  
  isAssigning = signal(false);
  
  onAssignTable(): void {
    if (this.seatPartyForm.valid) {
      const { partySize, selectedTableId } = this.seatPartyForm.value;
      this.isAssigning.set(true);
      
      this.tableFacade.seatPartyAtTable(selectedTableId!, partySize!)
        .pipe(
          finalize(() => this.isAssigning.set(false))
        )
        .subscribe({
          next: () => this.seatPartyForm.reset(),
          error: (error) => console.error('Failed to seat party:', error)
        });
    }
  }
}
```

### 7. Main App Component & Routing

**File**: `src/app/app.component.ts`

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TableStatusListComponent, SeatPartyComponent],
  template: `
    <div class="min-h-screen bg-gray-900 text-white">
      <header class="bg-gray-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-white">TableMaster</h1>
            </div>
            <nav class="flex items-center space-x-4">
              <button (click)="currentView.set('tables')" 
                      [class]="currentView() === 'tables' ? 'bg-blue-600' : 'bg-gray-600'"
                      class="px-4 py-2 rounded-md text-white font-medium transition-colors">
                Table Status
              </button>
              <button (click)="currentView.set('seating')"
                      [class]="currentView() === 'seating' ? 'bg-blue-600' : 'bg-gray-600'"
                      class="px-4 py-2 rounded-md text-white font-medium transition-colors">
                Seat Party
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="max-w-7xl mx-auto py-6">
        @if (currentView() === 'tables') {
          <app-table-status-list [tables]="tableFacade.allTables()" />
        } @else if (currentView() === 'seating') {
          <app-seat-party />
        }
      </main>
    </div>
  `
})
export class AppComponent {
  currentView = signal<'tables' | 'seating'>('tables');
  
  protected tableFacade = inject(TableFacade);
}
```

### 8. Mock Data & HTTP Interceptor

**File**: `src/app/core/interceptors/mock-data.interceptor.ts`

Create an HTTP interceptor that provides realistic mock data for development and testing:

```typescript
@Injectable()
export class MockDataInterceptor implements HttpInterceptor {
  private mockTables: Table[] = [
    { id: '1', number: 1, capacity: 2, status: 'available' },
    { id: '2', number: 2, capacity: 4, status: 'occupied' },
    { id: '3', number: 3, capacity: 6, status: 'available' },
    { id: '4', number: 4, capacity: 4, status: 'cleaning' },
    { id: '5', number: 5, capacity: 2, status: 'reserved' },
    { id: '6', number: 6, capacity: 8, status: 'available' },
    { id: '7', number: 7, capacity: 4, status: 'available' },
    { id: '8', number: 8, capacity: 2, status: 'occupied' }
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Handle GET /api/tables
    if (req.method === 'GET' && req.url === '/api/tables') {
      return of(new HttpResponse({
        status: 200,
        body: this.mockTables
      })).pipe(delay(500)); // Simulate network delay
    }

    // Handle PATCH /api/tables/:id/status and /api/tables/:id/seat
    if (req.method === 'PATCH' && req.url.startsWith('/api/tables/')) {
      const tableId = req.url.split('/')[3];
      const table = this.mockTables.find(t => t.id === tableId);
      
      if (table) {
        if (req.body.status) {
          table.status = req.body.status;
        }
        
        return of(new HttpResponse({
          status: 200,
          body: table
        })).pipe(delay(300));
      }
    }

    return next.handle(req);
  }
}
```

## Styling Requirements

### Tailwind Configuration

- Dark theme as default
- Modern gray color palette (gray-900 background, gray-800 cards)
- Blue accent colors for interactive elements
- Proper hover states and transitions
- Responsive design (mobile-first)

### Design Principles

- Clean, minimal interface
- Generous white space
- Clear visual hierarchy
- Accessible contrast ratios
- Smooth transitions and hover effects

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── facades/
│   │   │   └── table.facade.ts
│   │   ├── services/
│   │   │   ├── table-api.service.ts
│   │   │   └── table-display.service.ts
│   │   └── interceptors/
│   │       └── mock-data.interceptor.ts
│   ├── features/
│   │   ├── tables/
│   │   │   └── components/
│   │   │       └── table-status-list.component.ts
│   │   └── seating/
│   │       └── components/
│   │           └── seat-party.component.ts
│   ├── shared/
│   │   └── models/
│   │       └── table.model.ts
│   ├── app.component.ts
│   └── app.config.ts
```

## Additional Requirements

### Testing Setup

- Configure Jasmine/Karma with proper TypeScript support
- Include testing utilities and mock data helpers
- Set up code coverage reporting
- Ensure all components have proper `data-testid` attributes for testing

### Development Experience

- Include ESLint with Angular-specific rules
- Configure strict TypeScript settings
- Include proper error handling and logging

### Performance

- Use OnPush change detection where appropriate
- Implement proper trackBy functions in templates
- Optimize bundle size with standalone components
- Lazy load features if needed

## Success Criteria

1. All components render correctly with dark theme
1. Mock API responses work properly
1. Forms validate and submit successfully
1. Real-time table filtering works in seat party component
1. Clean architecture boundaries are maintained
1. Modern Angular syntax used throughout
1. All features have proper test attributes
1. Mobile-responsive design
1. Accessible UI with proper ARIA labels
1. Professional, sleek appearance suitable for a course demo

This application should serve as a perfect example of modern Angular development practices while providing realistic scenarios for comprehensive unit testing education.

## Step-by-Step Implementation Plan

### Phase 1: Project Setup and Configuration

#### Step 1.1: Initialize Angular 20 Project
```bash
ng new table-master --routing=false --style=css --standalone --strict
cd table-master
```

#### Step 1.2: Install and Configure Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```
- Configure `tailwind.config.js` with dark mode and content paths
- Update `styles.css` with Tailwind directives
- Configure Angular to use PostCSS

#### Step 1.3: Configure Jest for Testing (Setup Only)
```bash
npm install -D jest @types/jest jest-preset-angular
```
- Create `setup-jest.ts` configuration file
- Update `tsconfig.spec.json` for Jest
- Add Jest configuration to `package.json`
- Note: No tests will be written (course will cover this)

#### Step 1.4: Configure TypeScript Strict Mode
- Verify `tsconfig.json` has all strict flags enabled
- Set up proper path aliases for clean imports

### Phase 2: Core Architecture Setup

#### Step 2.1: Create Project Structure
```
src/app/
├── core/
│   ├── facades/
│   ├── services/
│   └── interceptors/
├── features/
│   ├── tables/
│   │   └── components/
│   └── seating/
│       └── components/
└── shared/
    └── models/
```

#### Step 2.2: Create Core Models
- Create `src/app/shared/models/table.model.ts`
- Define `TableStatus` type union
- Define `Table` interface
- Define `WaitlistCustomer` interface

### Phase 3: Services Implementation

#### Step 3.1: Implement TableDisplayService
- Create `src/app/core/services/table-display.service.ts`
- Implement `formatStatus()` method for human-readable status
- Implement `getStatusColor()` method for Tailwind classes
- Use `@Injectable({ providedIn: 'root' })`

#### Step 3.2: Implement TableApiService
- Create `src/app/core/services/table-api.service.ts`
- Use `inject(HttpClient)` for HTTP operations
- Implement `getTables()` returning `Observable<Table[]>`
- Implement `updateTableStatus()` method
- Implement `seatPartyAtTable()` method
- All methods return proper typed Observables

### Phase 4: State Management with Facades

#### Step 4.1: Create TableFacade
- Create `src/app/core/facades/table.facade.ts`
- Use signals for state management (`signal<Table[]>`)
- Implement `allTables()` method with lazy loading
- Implement `updateTableStatus()` with optimistic updates
- Implement `seatPartyAtTable()` with state synchronization
- Use proper RxJS operators (tap, catchError, finalize)

### Phase 5: Components Implementation

#### Step 5.1: Create TableStatusListComponent
- Create `src/app/features/tables/components/table-status-list.component.ts`
- Use standalone component with inline template
- Implement grid layout with responsive breakpoints
- Use `@for` control flow for table iteration
- Use `@empty` block for no tables state
- Add proper `data-testid` attributes for testing
- Use `input()` function for tables property

#### Step 5.2: Create SeatPartyComponent
- Create `src/app/features/seating/components/seat-party.component.ts`
- Use ReactiveFormsModule for form handling
- Implement form with FormBuilder using `inject()`
- Create `computed()` signals for derived state
- Implement `availableTables` filtering logic
- Add form validation (min/max party size)
- Handle async submission with loading state
- Use `@if` control flow for conditional rendering

### Phase 6: Mock Data Layer

#### Step 6.1: Create MockDataInterceptor
- Create `src/app/core/interceptors/mock-data.interceptor.ts`
- Implement HttpInterceptor interface
- Create realistic mock table data array
- Handle GET `/api/tables` endpoint
- Handle PATCH endpoints for status updates
- Add simulated network delay with `delay()` operator
- Ensure proper state mutations for PATCH requests

### Phase 7: Main Application Setup

#### Step 7.1: Configure AppComponent
- Update `src/app/app.component.ts`
- Create dark theme layout with header
- Implement view switching with signals
- Add navigation buttons with active states
- Import and use child components
- Use `@if` control flow for view rendering
- Inject and expose TableFacade

#### Step 7.2: Configure Application Providers
- Update `src/app/app.config.ts`
- Provide HttpClient with `provideHttpClient()`
- Register MockDataInterceptor with `withInterceptors()`
- Configure any additional providers needed

### Phase 8: Styling and Polish

#### Step 8.1: Configure Tailwind Dark Theme
- Update `tailwind.config.js` with dark mode configuration
- Set color palette (gray-900, gray-800, blue accents)
- Configure responsive breakpoints

#### Step 8.2: Apply Component Styling
- Apply dark background (bg-gray-900) to app
- Style cards with bg-gray-800 and shadows
- Add hover states and transitions
- Ensure proper contrast ratios
- Style form inputs with dark theme
- Add loading and disabled states

### Phase 9: Final Integration and Testing

#### Step 9.1: Verify Component Integration
- Ensure TableFacade properly manages state
- Verify table status updates reflect immediately
- Test seat party form validation and submission
- Confirm mock interceptor handles all API calls

#### Step 9.2: Test Responsive Design
- Verify mobile layout (grid columns adjust)
- Test tablet breakpoints
- Ensure desktop layout optimal

#### Step 9.3: Accessibility Check
- Verify all interactive elements are keyboard accessible
- Add proper ARIA labels where needed
- Ensure color contrast meets WCAG standards
- Test with screen reader (optional)

### Phase 10: Development Experience

#### Step 10.1: Configure Development Tools
- Set up ESLint with Angular rules
- Configure Prettier for code formatting
- Add npm scripts for common tasks
- Set up pre-commit hooks (optional)

#### Step 10.2: Documentation
- Add inline comments for complex logic
- Document facade methods
- Create simple README with startup instructions

### Key Implementation Notes

1. **Angular 20 Specific Features**:
   - Use `@for`, `@if`, `@else` instead of `*ngFor`, `*ngIf`
   - Use `inject()` function instead of constructor injection
   - Use signals for reactive state management
   - Use `input()` and `input.required()` for component inputs

2. **Architecture Principles**:
   - Components only handle UI logic
   - Facades manage state with signals
   - Services handle API calls with Observables
   - Clean separation of concerns

3. **Testing Preparation**:
   - All components have `data-testid` attributes
   - Services return proper typed responses
   - Facades expose signals for easy testing
   - Mock interceptor provides consistent test data

4. **Performance Considerations**:
   - Use OnPush change detection where applicable
   - Implement proper trackBy in `@for` loops
   - Lazy load data only when needed
   - Use computed signals for derived state

### Completion Checklist

- [ ] Angular 20 project created with strict TypeScript
- [ ] Tailwind CSS configured with dark theme
- [ ] Jest configured (no tests written)
- [ ] All models and types defined
- [ ] TableDisplayService implemented
- [ ] TableApiService with all endpoints
- [ ] TableFacade with signal-based state
- [ ] TableStatusListComponent with grid layout
- [ ] SeatPartyComponent with form validation
- [ ] MockDataInterceptor providing realistic data
- [ ] AppComponent with navigation
- [ ] Dark theme applied throughout
- [ ] Responsive design working
- [ ] All data-testid attributes in place
- [ ] Modern Angular patterns used throughout
- [ ] Clean architecture boundaries maintained
