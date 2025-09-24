// src/modules/user_items/dtos/ICreateUserItemDTO.ts
export interface ICreateUserItemDTO {
  user_id: string;   // usuário dono do item
  item_id: string;   // referência ao item (pode vir de itens já cadastrados)
  quantity?: number; // quantidade do item
  notes?: string;    // observações opcionais

  // snapshot do item no momento da criação
  snapshotTitle?: string;
  snapshotPrice?: number;
  snapshotImages?: string; // JSON.stringify(item.images)
  snapshotMarketplace?: string;
  snapshotExternalId?: string;
}
