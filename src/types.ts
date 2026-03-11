export type StockStatus = 'healthy' | 'low' | 'out';

export interface Department {
  id: string;
  name: string;
  head: string;
}

export interface Program {
  id: string;
  name: string;
  departmentId: string;
  startDate: string;
  endDate: string;
}

export interface ProgramIssue {
  id: string;
  programId: string;
  itemId: string;
  itemName: string;
  unit: string;
  date: string;
  expectedReturnDate?: string;
  collectedBy?: string;
  phone?: string;
  departmentId?: string;
  issuer?: string;
  issued: number;
  returned: number;
  noReturn: number;
  exchange: number;
  consumed: number;
  missing: number;
  damaged: number;
  discarded: number;
  pending: number;
  status: '✅ All Returned' | '🟠 DUE FOR RETURN ⏰' | '🚫 Non-Returnable' | '⚠️ Partially Returned';
  remarks?: string;
  pocName: string;
  pocContact?: string;
  isConsumable: boolean;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  unit: string;
  totalStock: number;
  minThreshold: number;
  departmentId?: string;
  store?: string;
  isConsumable: boolean;
  expiryDate?: string;
  imageUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  type: 'storage' | 'residential' | 'kitchen' | 'office';
  itemCount: number;
  status: StockStatus;
}

export interface StoreInventoryItem {
  itemId: string;
  storeId: string;
  quantity: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'adjustment' | 'transfer' | 'checkout' | 'restock' | 'return';
  itemId: string;
  itemName: string;
  quantity: number;
  fromStoreId?: string;
  toStoreId?: string;
  timestamp: string;
  user: string;
  note?: string;
  purchaseCode?: string;
}
