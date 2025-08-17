import User from '../../typeorm/entities/User';
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import SessionsController from '../controllers/SessionsController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import dataSource from '@shared/infra/typeorm/data-source';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

// ---------- LOGOUT ----------
sessionsRouter.post('/logout', isAuthenticated, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  // Pega o repository
  const usersRepository = dataSource.getRepository(User);

  // Aqui você poderia deletar sessão se tivesse tabela, mas por enquanto:
  return res.status(200).json({ message: 'Logout realizado com sucesso' });
});

// ---------- RESET SCRAP (DEV) ----------
sessionsRouter.post(
  '/reset-scrap',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  async (req, res) => {
    const { email } = req.body;
    const usersRepository = dataSource.getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.hasUsedFreeScrap = false;
    await usersRepository.save(user);

    return res.json({ message: 'Status resetado com sucesso' });
  }
);

export default sessionsRouter;
