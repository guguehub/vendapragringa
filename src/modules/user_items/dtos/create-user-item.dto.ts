export interface ICreateUserItemDto {
  user_id: string;   // usuário dono do item
  item_id: string;   // referência ao item (pode vir de itens já cadastrados)
  quantity: number;  // quantidade do item
  notes?: string;    // observações opcionais do usuário
}
