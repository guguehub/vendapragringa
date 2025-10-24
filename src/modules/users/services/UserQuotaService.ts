import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
//import IUserRepository from '../domain/repositories/IUserRepository';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IIncrementOptions {
  userId: string;
  type: 'scrape' | 'saved_item' | 'user_item';
  amount?: number;
}

@injectable()
export default class UserQuotaService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
  ) {}

  /**
   * Incrementa contadores de uso do usuário e checa limites.
   */
  public async increment({ userId, type, amount = 1 }: IIncrementOptions): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new AppError('Usuário não encontrado.');

    switch (type) {
      case 'scrape':
        await this.handleScrapeLimit(user, amount);
        break;

      case 'saved_item':
        await this.handleItemLimit(user, amount);
        break;

      case 'user_item':
        await this.handleUserItemLimit(user, amount);
        break;

      default:
        throw new AppError(`Tipo de limite inválido: ${type}`);
    }

    return this.usersRepository.save(user);
  }

  // 🔹 Limite de raspagens
  private async handleScrapeLimit(user: User, amount: number) {
    const limit = user.scrape_balance ?? 0;
    const used = user.scrape_count ?? 0;

    if (used + amount > limit) {
      throw new AppError('Limite de raspagens atingido. Faça upgrade de plano.');
    }

    user.scrape_count = used + amount;
  }

  // 🔹 Limite de itens salvos
  private async handleItemLimit(user: User, amount: number) {
    const limit = user.item_limit ?? 0;
    const used = user.scrape_balance ?? 0; // opcionalmente criar campo separado depois

    if (used + amount > limit) {
      throw new AppError('Limite de itens salvos atingido. Faça upgrade de plano.');
    }

    user.scrape_balance = used + amount;
  }

  // 🔹 Limite de user items (itens customizados)
  private async handleUserItemLimit(user: User, amount: number) {
    const limit = user.item_limit ?? 0; // por enquanto usamos o mesmo campo
    const used = user.daily_bonus_count ?? 0;

    if (used + amount > limit) {
      throw new AppError('Limite de itens personalizados atingido.');
    }

    user.daily_bonus_count = used + amount;
  }
}
