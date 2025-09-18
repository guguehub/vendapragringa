import { sign, Secret } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import dataSource from '@shared/infra/typeorm/data-source';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

export default class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = dataSource.getRepository(User);

    console.log('[DEBUG] Tentando autenticar usuário com email:', email);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      console.error('[DEBUG] Usuário não encontrado com email:', email);
      throw new AppError('Incorrect email/password combination.', 401);
    }

    console.log('[DEBUG] Usuário encontrado:', {
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    });

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      console.error('[DEBUG] Senha incorreta para usuário:', user.email);
      throw new AppError('Incorrect email/password combination.', 401);
    }

    console.log('[DEBUG] Senha validada para usuário:', user.email);

    // Incluindo is_admin no payload do JWT
    const payload = { is_admin: user.is_admin };
    console.log('[DEBUG] Payload do JWT:', payload);

    const token = sign(payload, authConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    console.log('[DEBUG] Token JWT gerado com sucesso para usuário:', user.email);

    return {
      user,
      token,
    };
  }
}
