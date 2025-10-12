import { Repository } from 'typeorm';
import { injectable } from 'tsyringe';

import AppDataSource from '@shared/infra/typeorm/data-source';
import IUserItemsRepository from '@modules/user_items/domain/repositories/IUserItemsRepository';
import { ICreateUserItemDTO } from '@modules/user_items/dtos/ICreateUserItemDTO';
import UserItem from '../entities/UserItems';

@injectable()
class UserItemsRepository implements IUserItemsRepository {
  private ormRepository: Repository<UserItem>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserItem);
  }

  /**
   * Cria um novo UserItem no banco (sempre insert).
   */
  public async create(data: ICreateUserItemDTO): Promise<UserItem> {
    const mappedData = {
      ...data,
      userId: data.user_id,
      itemId: data.item_id,
      snapshotImages: Array.isArray(data.snapshotImages)
        ? data.snapshotImages
        : data.snapshotImages
        ? [data.snapshotImages]
        : [],
    };

    const userItem = this.ormRepository.create(mappedData);
    return this.ormRepository.save(userItem);
  }

  /**
   * Salva alterações em um UserItem existente (pode virar insert se não tiver PK).
   */
  public async save(userItem: UserItem): Promise<UserItem> {
    return this.ormRepository.save(userItem);
  }

  /**
   * Alias para save (mantido por compatibilidade).
   */
  public async update(userItem: UserItem): Promise<UserItem> {
    return this.ormRepository.save(userItem);
  }

  /**
   * Retorna um UserItem pelo ID.
   */
  public async findById(id: string): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['item'],
    });
  }

  /**
   * Lista todos os UserItems de um usuário.
   */
  public async findByUserId(userId: string): Promise<UserItem[]> {
    return this.ormRepository.find({
      where: { userId },
      relations: ['item'],
    });
  }

  /**
   * Busca um UserItem específico de um usuário e item.
   */
  public async findByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { userId, itemId },
      relations: ['item'],
    });
  }

  /**
   * Busca um UserItem específico por ID e userId.
   */
  public async findByIdAndUser(
    id: string,
    userId: string,
  ): Promise<UserItem | null> {
    return this.ormRepository.findOne({
      where: { id, userId },
      relations: ['item'],
    });
  }

  /**
   * Lista todos os UserItems de um usuário.
   * (Alias para findByUserId)
   */
  public async listByUser(userId: string): Promise<UserItem[]> {
    return this.findByUserId(userId);
  }

  /**
   * Retorna um UserItem pelo ID (Alias para findById).
   */
  public async show(id: string): Promise<UserItem | null> {
    return this.findById(id);
  }

  /**
   * Deleta um UserItem pelo ID.
   */
  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  /**
   * Remove uma entidade UserItem específica.
   */
  public async remove(userItem: UserItem): Promise<void> {
    await this.ormRepository.remove(userItem);
  }
}

export default UserItemsRepository;
