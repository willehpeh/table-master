import { Injectable } from '@angular/core';
import { TableStatus } from '../../shared/models/table.model';

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