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
    private createUserQuotaService: CreateUserQuotaService,
  ) {}

  public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    // 1️⃣ Verifica duplicidade de e-mail
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    // 2️⃣ Criptografa a senha
    const hashedPassword = await this.hashProvider.generateHash(password);

    // 3️⃣ Cria o usuário (apenas com campos definidos no ICreateUser)
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4️⃣ Cria quotas iniciais automaticamente
    await this.createUserQuotaService.execute({
      user_id: user.id,
      saved_items_limit: 100,
      scrape_logs_limit: 200,
    });

    // 5️⃣ Retorna o usuário criado
    return user;
  }
}

export default CreateUserService;
