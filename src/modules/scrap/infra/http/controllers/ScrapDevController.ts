import { Request, Response } from 'express';

declare global {
  // status de scrap por usuário
  var scrapStatus: Record<string, boolean>;
}

global.scrapStatus = global.scrapStatus || {};

export default class ScrapDevController {
  public async reset(request: Request, response: Response): Promise<Response> {
    const { userId } = request.body; // ou request.params / request.query, depende da tua rota

    if (!userId) {
      return response.status(400).json({ error: 'userId é obrigatório' });
    }

    global.scrapStatus[userId] = false;

    return response.json({
      message: `Scrap status resetado para usuário ${userId}!`
    });
  }
}
