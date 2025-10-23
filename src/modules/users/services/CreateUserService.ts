// src/modules/users/services/CreateUserService.ts
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { ICreateUser } from '../domain/models/ICreateUser';
import { IUser } from '../domain/models/IUser';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';

import CreateUserQuotaService from '@modules/user_quota/services/CreateUserQuotaService';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CreateUserQuotaService')
    private createUserQuota: CreateUserQuotaService,
  ) {}

  public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    // 1️⃣ Verifica se o email já existe
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    // 2️⃣ Gera hash da senha
    const hashedPassword = await this.hashProvider.generateHash(password);

    // 3️⃣ Cria o usuário com os campos básicos
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar: undefined, // opcional
    });

    // 4️⃣ Inicializa quotas e contadores automaticamente
    await this.createUserQuota.execute({
      user_id: user.id,
      saved_items_limit: 100,  // limite padrão de itens salvos
      scrape_logs_limit: 200,  // limite padrão de raspagens
    });

    // 5️⃣ Retorna usuário completo
    return user;
  }
}

export default CreateUserService;
