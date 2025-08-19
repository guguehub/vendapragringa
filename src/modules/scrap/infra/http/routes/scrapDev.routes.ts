import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import  AppDataSource from '@shared/infra/typeorm/data-source'
import User from '@modules/users/infra/typeorm/entities/User';

const scrapDevRouter = Router();

// Rota dev: resetar flag de raspagem grátis
scrapDevRouter.post(
  '/reset-scrap',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  async (req, res) => {
    const { email } = req.body;

    try {
      const usersRepository = AppDataSource.getRepository(User);

      const user = await usersRepository.findOneBy({ email });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      user.hasUsedFreeScrap = false;
      await usersRepository.save(user);

      return res.json({ message: 'Status resetado com sucesso' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Erro interno' });
    }
  },
);
// Resetar a flag de sessão do /scrap/once (precisa enviar o mesmo cookie da sessão)
scrapDevRouter.post('/reset-once', (req, res) => {
  // se não houver cookie/sessão, não dá pra resetar
  if (!req.session) {
    return res
      .status(400)
      .json({ message: 'Sessão inexistente. Envie o cookie da sessão.' });
  }

  req.session.scrapedOnce = false;
  return res.json({ message: 'Flag scrapedOnce resetada com sucesso.' });
});

export default scrapDevRouter;
