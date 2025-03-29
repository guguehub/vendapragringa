import { Router, Request, Response } from 'express';
const fetch = require('node-fetch');

import AbortController from 'abort-controller';

const fetchTestRouter = Router();

fetchTestRouter.get('/ml_item', async (req: Request, res: Response) => {
  const itemId = 'MLB2687312561';
  const url = `https://api.mercadolibre.com/items/${itemId}`;

  // Define a timeout duration (e.g., 5000 milliseconds or 5 seconds)
  const timeout = 5000;

  try {
    // Create an AbortController to handle the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId); // Clear the timeout upon successful response

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      res.status(408).json({ message: 'Request timed out' }); // 408 Request Timeout
    } else {
      console.error('Error:', error);
      res
        .status(500)
        .json({ message: 'Error fetching data', error: error.message });
    }
  }
});

export default fetchTestRouter;

//https://produto.mercadolivre.com.br/MLB-2687312561
//'https://official-joke-api.appspot.com/random_joke',

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
