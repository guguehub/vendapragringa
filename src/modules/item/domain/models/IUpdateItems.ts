interface IUpdateItem {
  id: string;               // obrigatório para identificar qual item atualizar
  title?: string;
  description?: string;
  price?: number;
  itemStatus?: string;      // pode virar enum futuramente
  soldCount?: number;
  condition?: string;       // pode virar enum futuramente
  shippingPrice?:number;
  status?: string;
  external_id?:string;
  marketplace:string;
  itemLink:string;
  images?: string;
    is_draft?: boolean;
  is_synced?: boolean;
  supplierId?: string;

  // outros campos opcionais para atualização
}

export { IUpdateItem };
