import { TableDisplayService } from './table-display.service';
import { TableStatus } from '../models/table.model';

describe('TableDisplayService', () => {

  it('should return "Available"', () => {
    const service = new TableDisplayService();
    const status = service.formatStatus('available');

    expect(status).toBe('Available');
  });

  it('should return "Occupied"', () => {
    const service = new TableDisplayService();
    const status = service.formatStatus('occupied');

    expect(status).toBe('Occupied');
  });

  it('should return "Being Cleaned"', () => {
    const service = new TableDisplayService();
    const status = service.formatStatus('cleaning');

    expect(status).toBe('Being Cleaned');
  });

  it('should return "Reserved"', () => {
    const service = new TableDisplayService();
    const status = service.formatStatus('reserved');

    expect(status).toBe('Reserved');
  });

  it('should return "Unknown"', () => {
    const service = new TableDisplayService();
    const status = service.formatStatus('invalid');

    expect(status).toBe('Unknown');
  });

});
