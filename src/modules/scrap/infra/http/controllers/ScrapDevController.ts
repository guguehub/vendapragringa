import { Request, Response } from "express";

declare global {
  var scrapStatus: Record<string, boolean>;
}

global.scrapStatus = global.scrapStatus || {};

export class ScrapDevController {
  /**
   * 🔄 Reseta a flag de raspagem única (rota anônima)
   */
  public async resetOnce(req: Request, res: Response): Promise<Response> {
    if (!(req as any).session) {
      return res.status(400).json({ message: "Sessão não encontrada." });
    }

    (req as any).session.scrapedOnce = false;

    return res.json({
      message: "Flag de raspagem anônima resetada com sucesso!",
    });
  }

  /**
   * 🔁 Reseta o status de raspagem ou quota de um usuário (modo dev)
   */
  public async resetScrap(req: Request, res: Response): Promise<Response> {
    const { email, userId } = req.body;

    if (!email && !userId) {
      return res.status(400).json({ message: "Informe email ou userId." });
    }

    // ⚙️ Aqui você pode integrar futuramente com UserQuotaService.resetQuota()
    const key = email || userId;
    global.scrapStatus[key] = false;

    return res.json({
      message: `Status de raspagem resetado para ${key}`,
    });
  }
}
