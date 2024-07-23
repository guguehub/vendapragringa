import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let createSession: CreateSessionService;
let fakeHashProvider: FakeHashProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Silva',
      email: 'teste@testeizer.com',
      password: '123456',
    });

    const response = await createSession.execute({
      email: 'teste@testeizer.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should NOT be able to authenticate w/ non exist email', async () => {
    expect(
      createSession.execute({
        email: 'test@tester.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT able to log wrong email combination', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Silva',
      email: 'teste@testeizer.com',
      password: '123456',
    });
    expect(
      createSession.execute({
        email: 'teste@testeizer.com',
        password: '1234599000',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
