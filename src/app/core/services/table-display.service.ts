import { Injectable } from '@angular/core';
import { TableStatus } from '../../shared/models/table.model';

@Injectable()
export class TableDisplayService {

  private FORMATTED_STATUSES: Record<TableStatus, string> = {
    available: 'Available',
    occupied: 'Occupied',
    cleaning: 'Being Cleaned',
    reserved: 'Reserved'
  };

  private STATUS_COLORS: Record<TableStatus, string> = {
    available: 'bg-green-500 text-white',
    occupied: 'bg-red-500 text-white',
    cleaning: 'bg-yellow-500 text-black',
    reserved: 'bg-blue-500 text-white'
  };

  formatStatus(status: TableStatus): string {
    return this.FORMATTED_STATUSES[status] || 'Unknown';
  }

  getStatusColor(status: TableStatus): string {
    return this.STATUS_COLORS[status] || 'bg-gray-500 text-white';
  }
}
