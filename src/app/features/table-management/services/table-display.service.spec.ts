import { TableDisplayService } from './table-display.service';

describe('TableDisplayService', () => {

  let service: TableDisplayService;

  beforeEach(() => {
    service = new TableDisplayService();
  });

  describe('formatStatus', () => {
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

  describe('getStatusColor', () => {
    it('should return "bg-green-500 text-white" for "available" status', () => {
      expectStatusColor('available', 'bg-green-500 text-white');
    });

    it('should return "bg-red-500 text-white" for "occupied" status', () => {
      expectStatusColor('occupied', 'bg-red-500 text-white');
    });

    it('should return "bg-yellow-500 text-black" for "cleaning" status', () => {
      expectStatusColor('cleaning', 'bg-yellow-500 text-black');
    });

    it('should return "bg-blue-500 text-white" for "reserved" status', () => {
      expectStatusColor('reserved', 'bg-blue-500 text-white');
    });

    it('should return "bg-gray-500 text-white" for unknown status', () => {
      expectStatusColor('invalid status', 'bg-gray-500 text-white');
    });

    function expectStatusColor(status: string, expected: string) {
      expect(service.getStatusColor(status)).toBe(expected);
    }
  });
});
