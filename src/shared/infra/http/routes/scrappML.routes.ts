import { Router, Request, Response } from 'express';
//import * as cheerio from 'cheerio';
const cheerio = require('cheerio');
const fetch = require('node-fetch');
*
const scrapTestRouter_fet = Router();

scrapTestRouter_fet.post('/scrap', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the HTML content of the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the URL: ${response.statusText}`);
    }
    const html = await response.text();

    // Load the HTML into Cheerio for parsing
    const $ = cheerio.load(html);

    // Extract the desired information using Cheerio selectors
    const title = $('h1.ui-pdp-title').text().trim();
    const price = $('span.andes-money-amount__fraction').first().text().trim();
    const currency = $('span.andes-money-amount__currency-symbol')
      .first()
      .text()
      .trim();
    const description = $('div.ui-pdp-description__content').text().trim();

    // Send the extracted data as a JSON response
    res.json({
      title,
      price: `${currency} ${price}`,
      description,
    });
  } catch (error) {
    console.error('Error scraping the URL:', error);
    res.status(500).json({ error: 'Failed to scrape the URL' });
  }
});

export default scrapTestRouter_fet;
