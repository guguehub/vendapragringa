import AppError from '@shared/errors/AppError';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
// import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider'; // descomente quando implementar S3
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUser } from '../domain/models/IUser';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import uploadConfig from '@config/upload';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    // Escolha do provedor de armazenamento
    let storageProvider;

    if ('driver' in uploadConfig && uploadConfig.driver === 's3') {
      // futuramente, quando S3 estiver implementado
      // storageProvider = new S3StorageProvider();
      throw new AppError('S3StorageProvider ainda não implementado.');
    } else {
      storageProvider = new DiskStorageProvider();
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const filename = await storageProvider.saveFile(avatarFilename);
    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
