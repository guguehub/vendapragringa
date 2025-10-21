import { ICreateUserAddress } from './ICreateUserAddress';

/**
 * Interface de atualização de endereço de usuário.
 *
 * Herda todos os campos de ICreateUserAddress como opcionais,
 * permitindo atualizações parciais (ex: apenas cidade ou telefone).
 */
export interface IUpdateUserAddress extends Partial<ICreateUserAddress> {
  id: string; // obrigatório para identificar o endereço a ser atualizado
  user_id?: string; // opcional, usado para validar propriedade
}
