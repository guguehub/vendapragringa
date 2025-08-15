// Em algum arquivo de rotas ou app.js temporariamente
import { Router } from 'express';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const testRouter = Router();

testRouter.get('/test-user', isAuthenticated, (req, res) => {
  return res.json({ sub: req.user.id });
});

export default testRouter;
