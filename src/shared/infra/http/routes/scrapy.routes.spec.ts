// src/shared/infra/http/routes/scrapy.routes.ts

import { Router, Request, Response } from 'express';

import identifyUser from '../../../../shared/infra/http/middlewares/identifyUser';
import { scrapeMercadoLivre } from '@modules/scrap/scrapy';

const scrapyRouter = Router();

scrapyRouter.post(
  '/scrapy',
  identifyUser,
  async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      console.log('[scrapy] ❌ Received request without URL');
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const data = await scrapeMercadoLivre(url);

      if (req.user) {
        console.log(
          `[scrapy] ✅ Authenticated request from user ID: ${req.user.id}`,
        );
      } else {
        console.log('[scrapy] 👤 Request from guest user');
      }

      return res.json(data);
    } catch (error: any) {
      console.error('[scrapy] 🛑 Scraping error:', error);
      return res.status(500).json({ error: 'Failed to scrape the URL' });
    }
  },
);

export default scrapyRouter;
