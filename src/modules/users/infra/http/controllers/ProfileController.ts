import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';

export default class ProfileController {
  // Mostrar perfil do usuário autenticado
  public async show(request: Request, response: Response): Promise<Response> {
    if (!request.user) {
      return response.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const user_id = request.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ id: user_id });


    return response.json(instanceToInstance(user));
  }

  // Atualizar perfil do usuário autenticado
  public async update(request: Request, response: Response): Promise<Response> {
    if (!request.user) {
      return response.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(instanceToInstance(user));
  }

  /*
  public async delete(request: Request, response: Response): Promise<Response> {
    if (!request.user) {
      return response.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const { id } = request.params;
    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ id });

    return response.status(204).send();
  }
  */
}
