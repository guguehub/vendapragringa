import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SaveAsUserItemService from '@modules/user_items/services/SaveAsUserItemService';

export default class SaveAsUserItemController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // vem do middleware de autenticação
    const { item_id, quantity, import_stage } = request.body;

    const saveAsUserItemService = container.resolve(SaveAsUserItemService);

    const userItem = await saveAsUserItemService.execute({
      user_id,
      item_id,
      quantity,
      import_stage,
    });

    return response.status(201).json(userItem);
  }
}
