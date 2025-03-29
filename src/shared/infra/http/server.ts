const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMercadoLivre(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const $ = cheerio.load(html);

    // Extrair título
    const title = $('h1.ui-pdp-title').text().trim();

    // Extrair preço do produto
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

    // Extrair descrição
    const description = $('.ui-pdp-description__content').text().trim();

    // 🔹 **CORREÇÃO DO FRETE**
    let shippingInfo = 'Frete não disponível';

    // Busca se há frete grátis no texto da página
    const freeShippingText = $('p.ui-pdp-color--GREEN').text().toLowerCase();
    if (freeShippingText.includes('frete grátis')) {
      shippingInfo = 'Frete grátis';
    } else {
      // Caso não seja grátis, tentar capturar o preço do frete
      const shippingCost = $('.ui-pdp-price__subtext')
        .text()
        .match(/R\$\s?([\d,.]+)/);

      if (shippingCost) {
        shippingInfo = `R$ ${shippingCost[1]}`;
      }
    }

    // Criar objeto final
    const productDetails = { title, price, description, shippingInfo };
    console.log(productDetails);

    return productDetails;
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message);
  }
}

// Exemplo de uso
const url =
  'https://produto.mercadolivre.com.br/MLB-3598030249-lp-flavio-mattes-deva-quem-diria-_JM';
scrapeMercadoLivre(url);
