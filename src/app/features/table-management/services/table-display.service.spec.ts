import { TableDisplayService } from './table-display.service';

describe('TableDisplayService', () => {

  let service: TableDisplayService;

  beforeEach(() => {
    service = new TableDisplayService();
  });

  it('should return "Available"', () => {
    expectFormattedStatus('available', 'Available');
  });

  it('should return "Occupied"', () => {
    expectFormattedStatus('occupied', 'Occupied');
  });

  it('should return "Being Cleaned"', () => {
    expectFormattedStatus('cleaning', 'Being Cleaned');
  });

  it('should return "Reserved"', () => {
    expectFormattedStatus('reserved', 'Reserved');
  });

  it('should return "Unknown" if the requested status is not recognized', () => {
    expectFormattedStatus('invalid status', 'Unknown');
  });

  function expectFormattedStatus(status: string, expected: string) {
    expect(service.formatStatus(status)).toBe(expected);
  }

});
