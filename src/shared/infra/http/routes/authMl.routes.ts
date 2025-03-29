import { Router, Request, Response } from 'express';
import { URLSearchParams } from 'url';
const fetch = require('node-fetch');
require('dotenv').config();

const authPostRouter = Router();

authPostRouter.post('/auth', async (req: Request, res: Response) => {
  const { code } = req.body; // Obtain authorization code from request body
  const app_id = process.env.APP_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = 'https://www.google.com.br'; // Ensure this matches your registered URI

  const tokenEndpoint = 'https://api.mercadolibre.com/oauth/token';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: app_id,
    client_secret: client_secret,
    code: code,
    redirect_uri: redirect_uri,
  });

  try {
    // Set a timeout of 5000 milliseconds (5 seconds)
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: headers,
      body: body.toString(),
      signal: AbortSignal.timeout(5000), // Automatically aborts after 5 seconds
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`,
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error.name === 'TimeoutError') {
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

export default authPostRouter;

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
