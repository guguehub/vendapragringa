const fetch = require('node-fetch');

// src/shared/infra/http/routes/fetchTest.routes.ts
import { Router, Request, Response } from 'express';

const postTestRouter = Router();

postTestRouter.post('/postTest', async (req: Request, res: Response) => {
  try {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const data = {
      title: 'a long way',
      body: 'a long way to the top if you wanna rocknroll',
      userId: 1,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching data', error: error.message });
  }
});

export default postTestRouter;
