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