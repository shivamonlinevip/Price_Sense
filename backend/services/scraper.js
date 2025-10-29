import puppeteer from 'puppeteer';

export async function scrapePrice(queryOrUrl){
  try {
    let url = queryOrUrl;
    if(!/^https?:\/\//i.test(queryOrUrl)){
      // search Amazon and Flipkart; start with Amazon search
      url = `https://www.amazon.in/s?k=${encodeURIComponent(queryOrUrl)}`;
    }
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // If search result page -> grab first listing
    const isSearch = /\/s\?k=/.test(url);
    let data = null;
    if(isSearch){
      data = await page.evaluate(()=>{
        const sel = document.querySelector('h2 a span');
        const priceEl = document.querySelector('.a-price .a-price-whole');
        const title = sel?.innerText || document.querySelector('title')?.innerText;
        const priceTxt = priceEl?.innerText || null;
        const raw = priceTxt ? priceTxt.replace(/[^0-9]/g,'') : null;
        return { title, price: raw? Number(raw): null };
      });
      // if no price found on Amazon search, try Flipkart search page
      if(!data || !data.price){
        await page.goto(`https://www.flipkart.com/search?q=${encodeURIComponent(queryOrUrl)}`, { waitUntil: 'domcontentloaded' });
        data = await page.evaluate(()=>{
          const title = document.querySelector('a.s1Q9rs')?.innerText || document.querySelector('a.IRpwTa')?.innerText || document.querySelector('title')?.innerText;
          const priceTxt = document.querySelector('div._30jeq3')?.innerText || null;
          const raw = priceTxt ? priceTxt.replace(/[^0-9]/g,'') : null;
          return { title, price: raw? Number(raw): null };
        });
      }
    } else {
      // product page selectors
      data = await page.evaluate(()=>{
        const title = document.querySelector('#productTitle')?.innerText || document.querySelector('title')?.innerText;
        const priceTxt = document.querySelector('#priceblock_ourprice')?.innerText || document.querySelector('#priceblock_dealprice')?.innerText || document.querySelector('.a-price .a-price-whole')?.innerText || null;
        const raw = priceTxt ? priceTxt.replace(/[^0-9]/g,'') : null;
        return { title, price: raw? Number(raw): null };
      });
    }
    await browser.close();
    if(!data || !data.price) return null;
    return { product: data.title.trim(), price: Math.round(data.price), source: 'scraper' };
  } catch (e) {
    console.error('scrapePrice error', e.message || e);
    return null;
  }
}
