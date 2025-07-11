import 'reflect-metadata';
import 'dotenv/config';
import { app } from './app';
//import { dataSource } from '../typeorm/';
import dataSource from '../typeorm/data-source';

dataSource.initialize().then(() => {
  const server = app.listen(process.env.PORT || 3333, () => {
    console.log(
      `server started on port ${process.env.PORT || 3333} ooobaa!🏆 `,
    );
  });
});
export default dataSource;
