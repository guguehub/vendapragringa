export interface IUpdateProduct {
  id: string;
  name?: string; // Optional, because the user may not update the name
  price?: number; // Optional, for updating the price
  quantity?: number; // Optional, for updating the quantity
  url?: string; // Optional, for updating the product's URL on the marketplace
  marketplace?: string; // Optional, for updating the marketplace field
  supplierId?: string; // Optional, for updating the supplier ID
}
