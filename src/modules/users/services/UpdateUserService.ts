import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { container, inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUser } from '../domain/models/IUser';
import { IUpdateUser } from '../domain/models/IUpdateUser';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
    password, // old_password,
  }: IUpdateUser): Promise<IUser> {
    const usersRepository = container.resolve(UsersRepository);

    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userUpdateEmail = await usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id == id) {
      throw new AppError('there is already one user with this email.');
    }
    /*

    if (password && !old_password) {
      throw new AppError('old password is required');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await hash(password, 8);
    } */

    user.name = name;
    user.email = email;

    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserService;
