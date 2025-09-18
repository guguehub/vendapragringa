// src/__tests__/users/create-user.test.ts
import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('✅ should create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Silva',
      email: 'john.silva@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('john.silva@example.com');
  });

  it('🚫 should not allow duplicate emails', async () => {
    await createUser.execute({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Jane Doe Clone',
        email: 'jane.doe@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('🔒 should hash the password when creating user', async () => {
    const user = await createUser.execute({
      name: 'Alice Tester',
      email: 'alice@example.com',
      password: 'plainpassword',
    });

    // No caso do FakeHashProvider, ele só retorna "hashed-${password}"
    expect(user.password).toBe('hashed-plainpassword');
  });
});
