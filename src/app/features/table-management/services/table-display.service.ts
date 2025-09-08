import { Injectable } from '@angular/core';

@Injectable()
export class TableDisplayService {

  private FORMATTED_STATUSES: Record<string, string> = {
    available: 'Available',
    occupied: 'Occupied',
    cleaning: 'Being Cleaned',
    reserved: 'Reserved'
  };

  private STATUS_COLORS: Record<string, string> = {
    available: 'bg-green-500 text-white',
    occupied: 'bg-red-500 text-white',
    cleaning: 'bg-yellow-500 text-black',
    reserved: 'bg-blue-500 text-white'
  };

  formatStatus(status: string): string {
    return this.FORMATTED_STATUSES[status] || 'Unknown';
  }

  getStatusColor(status: string): string {
    return this.STATUS_COLORS[status] || 'bg-gray-500 text-white';
  }
}
