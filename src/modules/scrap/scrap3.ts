const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMercadoLivre(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(html);

    // 🔹 Título
    const title = $('h1.ui-pdp-title').text().trim();

    // 🔹 Preço
    const priceContainer = $('.ui-pdp-price__second-line');
    let price = '';
    if (priceContainer.length > 0) {
      const priceParts = priceContainer.text().trim().split(',');
      const wholePart = priceParts[0].replace(/\D/g, '');
      const decimalPart =
        priceParts[1]?.replace(/\D/g, '').padEnd(2, '0') || '00';
      price = `${wholePart}.${decimalPart}`;
    } else {
      const rawPrice = $('.andes-money-amount__fraction').first().text().trim();
      price = rawPrice.replace(/[^\d]/g, '').replace(/(\d+)(\d{2})$/, '$1.$2');
    }

    // 🔹 Descrição
    let description = $('.ui-pdp-description__content').text().trim();
    if (!description) {
      description =
        $('.ui-pdp-description__title').next().text().trim() ||
        'Sem descrição disponível';
    }

    // Truncar a descrição para 64 caracteres
    description = description.substring(0, 64).trim();

    // 🔹 Frete
    let shippingInfo = 'Frete não disponível';
    const freeShippingText = $('.ui-pdp-color--GREEN.ui-pdp-family--SEMIBOLD')
      .text()
      .toLowerCase();
    if (freeShippingText.includes('grátis')) {
      shippingInfo = 'Frete grátis';
    } else {
      const shippingContainer = $('.ui-pdp-shipping__option');
      const shippingCost = shippingContainer
        .find('.andes-money-amount__fraction')
        .text()
        .trim();
      if (shippingCost) {
        shippingInfo = `R$ ${shippingCost}`;
      }
    }

    // 🔹 Status do item
    let itemStatus = 'Status desconhecido';
    const statusContainer = $('.ui-pdp-main-actions__status');
    if (statusContainer.length > 0) {
      itemStatus = statusContainer.text().trim();
    } else {
      const soldOutStatus = $('.ui-pdp-main-actions__sold-out').text().trim();
      if (soldOutStatus) {
        itemStatus = 'Esgotado';
      } else {
        const possibleStatuses = [
          { selector: '.ui-pdp-main-actions__paused', status: 'Pausado' },
          { selector: '.ui-pdp-main-actions__closed', status: 'Encerrado' },
          { selector: '.ui-pdp-main-actions__inactive', status: 'Inativo' },
          {
            selector: '.ui-pdp-main-actions__under-review',
            status: 'Sob revisão',
          },
          {
            selector: '.ui-pdp-main-actions__payment-required',
            status: 'Pagamento pendente',
          },
          {
            selector: '.ui-pdp-main-actions__finished',
            status: 'Anúncio finalizado',
          },
        ];

        for (const { selector, status } of possibleStatuses) {
          if ($(selector).length > 0) {
            itemStatus = status;
            break;
          }
        }

        if (itemStatus === 'Status desconhecido') {
          const pageText = $('body').text().toLowerCase();
          if (pageText.includes('anúncio finalizado')) {
            itemStatus = 'Anúncio finalizado';
          } else {
            itemStatus = 'Ativo';
          }
        }
      }
    }

    // 🔹 Item ID
    // 🔹 Item ID Extraction
    // Função de extração de ID aprimorada
    const extractItemId = (url, $) => {
      try {
        // Tentar extrair da URL usando múltiplos padrões
        const urlPatterns = [
          /(MLB[A-Z]*-?\d+)/i, // Formato tradicional
          /\/up\/(MLB[A-Z]+\d+)/i, // URLs de catálogo
          /item_id=([A-Z0-9]+)/i, // Parâmetro item_id
          /_JM#([A-Z0-9]+)/i, // Fragmentos de URL
        ];

        for (const pattern of urlPatterns) {
          const match = url.match(pattern);
          if (match && match[1]) return match[1];
        }

        // Fallback para metadados da página
        const metaId =
          $('meta[itemprop="productID"]').attr('content') ||
          $('meta[property="og:url"]').attr('content');
        if (metaId) {
          const extracted = metaId.match(/(MLB[A-Z0-9]+)/i);
          if (extracted) return extracted[0];
        }
        // 3. Último recurso - input hidden
        const hiddenId = $('input[name="item_id"]').val();
        if (hiddenId) return `MLB${hiddenId}`;

        throw new Error('ID_EXTRACTION_FAILED');
      } catch (error) {
        //console.error(`Erro na extração do ID: ${url} - ${error.message}`);
        return null; // Retorna null em caso de erro
      }
    };
    const itemId = extractItemId(url, $);

    // 🔹 Objeto final
    return { title, price, description, shippingInfo, itemStatus, url, itemId };
  } catch (error) {
    //console.error(`Erro ao buscar dados do URL ${url}:`, error.message);

    let itemStatus = 'Anúncio não disponível';
    let errorDetails = error.message;
    if (error.response && error.response.status === 400) {
      itemStatus = 'Anúncio não disponível';
      errorDetails = 'Anúncio não disponível (status 400)'; // Mensagem mais clara
    }
    //console.error(`Erro ao buscar dados do URL ${url}:`, errorDetails);
    return {
      title: null,
      price: null,
      description: null,
      shippingInfo: null,
      itemStatus: itemStatus,
      url,
      itemId: null,
      errorDetails: errorDetails,
    };
  }
}

// Função para processar múltiplos URLs com intervalo
async function processUrls(urls) {
  const results = [];
  for (const url of urls) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
      const productDetails = await scrapeMercadoLivre(url);
      results.push(productDetails);
    } catch (error) {
      console.error(`Erro ao processar ${url}:`, error.message);
      results.push({ error: true, message: error.message, url });
    }
  }
  console.log('Resultados:', JSON.stringify(results, null, 5));
}

// URLs para testar
const urls = [
  'https://produto.mercadolivre.com.br/MLB-2197404989',
  'https://www.mercadolivre.com.br/lp-explorations-bill-evans-trio/up/MLBU1481610204',
  'https://produto.mercadolivre.com.br/MLB-4225368926',
  'https://www.mercadolivre.com.br/cd-tool--undertow--1993/up/MLBU1095682064?pdp_filters=item_id:MLB1615267043#position=16&search_layout=grid&type=item&tracking_id=1a1e374c-5d2d-46ac-8584-5935122b937b',
  'https://produto.mercadolivre.com.br/MLB-2138286985-boneco-transformers-estrela-antigo-saltman-1986-_JM#position=12&search_layout=grid&type=item&tracking_id=92d515e3-543a-4834-a125-666721600d16',
  'https://www.mercadolivre.com.br/cd-tool--undertow--1993/up/MLBU1095682064?pdp_filters=item_id:MLB1615267043#position=16&search_layout=grid&type=item&tracking_id=1a1e374c-5d2d-46ac-8584-5935122b937b',
  'https://produto.mercadolivre.com.br/MLB-2115545019-fonte-de-alimentaco-para-karaoke-vmp-3700-ou-3700-plus-_JM#polycard_client=recommendations_home_navigation-recommendations&reco_backend=machinalis-homes-univb-equivalent-offer&reco_client=home_navigation-recommendations&reco_item_pos=2&reco_backend_type=function&reco_id=fa9a43e9-9243-40b9-b1ac-41dacb7b2835&c_id=/home/navigation-recommendations/element&c_uid=621d89a6-1728-4d9a-99ff-796684ffe85b',
  //neymar
  'https://produto.mercadolivre.com.br/MLB-5190895718-prizm-card-neymar-jr-copa-mundo-2014-psa-9-_JM?searchVariation=182308606698#polycard_client=search-nordic&searchVariation=182308606698&position=5&search_layout=grid&type=item&tracking_id=8fa41ef2-16fc-4aaf-8661-188bb6bcac0d',
  'https://produto.mercadolivre.com.br/MLB-2714357958-ckl-5112-lp-12-polegadas-musica-chinesa-vinil-colorido-18314-_JM#polycard_client=search-nordic&position=47&search_layout=grid&type=item&tracking_id=cca03f4e-c6c5-4149-9646-8c72fe8c7bec&wid=MLB2714357958&sid=search',
];

// Processar os URLs
processUrls(urls);
