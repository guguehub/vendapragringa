export interface IUpdateStockProduct {
  id: string; // Product identifier (required)
  quantity?: number; // Optional, update only if quantity needs to change
  fromSupplier?: boolean; // Optional flag to indicate whether the stock change is coming from a supplier
}
