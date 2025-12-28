import 'reflect-metadata';
import 'dotenv/config';
import expressListEndpoints from 'express-list-endpoints';

import { app } from './app';
//import { dataSource } from '../typeorm/';
import dataSource from '../typeorm/data-source';

dataSource.initialize().then(() => {
  const server = app.listen(process.env.PORT || 3333, () => {
    console.log(
      `server started on port ${process.env.PORT || 3333} ooobaa!🏆 `,
    );
  });
   // ✅ Inicializa os crons somente depois que o DB está pronto
  import('@shared/infra/cron');
});
console.log(expressListEndpoints(app));

export default dataSource;
