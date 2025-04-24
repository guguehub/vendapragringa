const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMercadoLivre(url, options = {}) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Opção para capturar todas as informações
    if (options.all) {
      // Captura todo o HTML da página
      const allInfo = html;
      console.log('Todas as informações:', allInfo);
      return allInfo;
    }

    // Opção para capturar informações principais
    const title = $('h1.ui-pdp-title').text().trim();
    const priceContainer = $('.ui-pdp-price__second-line');
    let price = '';

    if (priceContainer.length > 0) {
      const priceParts = priceContainer.text().trim().split(',');
      const wholePart = priceParts[0].replace(/\D/g, '');
      const decimalPart = priceParts[1]
        ? priceParts[1].replace(/\D/g, '').padEnd(2, '0')
        : '00';
      price = `${wholePart}.${decimalPart}`;
    } else {
      const rawPrice = $('.andes-money-amount__fraction').first().text().trim();
      price = rawPrice.replace(/[^\d]/g, '').replace(/(\d+)(\d{2})$/, '$1.$2');
    }

    const description = $('.ui-pdp-description__content').text().trim();

    const productDetails = { title, price, description };
    console.log('Informações principais:', productDetails);
    return productDetails;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Exemplo de uso para capturar todas as informações
const url = 'https://produto.mercadolivre.com.br/MLB-4225368926';
scrapeMercadoLivre(url, { all: true });

// Exemplo de uso para capturar informações principais
//scrapeMercadoLivre(url);
