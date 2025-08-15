// src/modules/item/domain/models/IUpdateItem.ts

interface IUpdateItem {
  id: string;               // obrigatório para identificar qual item atualizar
  name?: string;            // campos opcionais para atualização
  description?: string;
  price?: number;
  // outros campos que podem ser atualizados, todos opcionais
}

export { IUpdateItem };
