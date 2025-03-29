import { Router, Request, Response } from 'express';
const fetch = require('node-fetch');

const fetchTestRouter2 = Router();

//https://produto.mercadolivre.com.br/MLB-2687312561
//'https://official-joke-api.appspot.com/random_joke',

fetchTestRouter2.get('/fetchTest2', async (req: Request, res: Response) => {
  try {
    const externalResponse = await fetch(
      'https://produto.mercadolivre.com.br/MLB-2687312561',
    );

    if (!externalResponse.ok) {
      throw new Error(`HTTP error! Status: ${externalResponse.status}`);
    }

    const data = await externalResponse.json();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching data', error: error.message });
  }
});

export default fetchTestRouter2;

/*  AXIOS VERSION
import { Router, Request, Response } from 'express';
import axios from 'axios';

const fetchTestRouter = Router();

fetchTestRouter.get('/fetchTest', async (req: Request, res: Response) => {
  try {
    const externalResponse = await axios.get('https://api.example.com/data');
    res.json(externalResponse.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching data', error: error.message });
  }
});

export default fetchTestRouter;
*/
