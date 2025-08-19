import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';
import isAdmin from '@shared/infra/http/middlewares/isAdmin';
import AppDataSource from '@shared/infra/typeorm/data-source';
import User from '@modules/users/infra/typeorm/entities/User';

const adminRouter = Router();

adminRouter.patch(
  '/users/:id/reset-free-scrap',
  isAuthenticated, // precisa estar logado
  isAdmin,         // precisa ser admin
  async (req, res) => {
    const { id } = req.params;
    const usersRepository = AppDataSource.getRepository(User);

    const user = await usersRepository.findOneBy({ id });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.hasUsedFreeScrap = false;
    await usersRepository.save(user);

    return res.json({ message: `Reset do free scrap feito para ${user.email}` });
  },
);

export default adminRouter;
