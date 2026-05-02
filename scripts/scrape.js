import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  console.log("Launching stealth browser to bypass Cloudflare...");
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  // Array to capture API responses
  let apiResponses = [];

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'];
    
    // We want to intercept their internal JSON API
    if (contentType && contentType.includes('application/json')) {
      try {
        const json = await response.json();
        console.log(`[Intercepted API] ${url}`);
        apiResponses.push({ url, data: json });
      } catch (e) {
        // Ignore parsing errors for preflight/empty responses
      }
    }
  });

  console.log("Navigating to https://toxicgame.net/ ...");
  await page.goto('https://toxicgame.net/', { waitUntil: 'networkidle2', timeout: 60000 });
  
  console.log("Waiting 10 seconds for Cloudflare challenge to clear and React app to hydrate...");
  await new Promise(r => setTimeout(r, 10000));

  // Extract from the DOM as a fallback if the API interception is obfuscated
  console.log("Extracting visible elements from DOM...");
  const domGames = await page.evaluate(() => {
    const results = [];
    const links = Array.from(document.querySelectorAll('a'));
    
    links.forEach(link => {
      const img = link.querySelector('img');
      if (img && img.src && img.src.startsWith('http')) {
        results.push({
          title: link.innerText.trim() || img.alt,
          image: img.src,
          href: link.href
        });
      }
    });
    
    // Filter out obvious non-game links (like social icons)
    return results.filter(g => g.title.length > 2 && !g.href.includes('twitter.com') && !g.href.includes('discord.gg'));
  });

  // Save the intercepted APIs
  fs.writeFileSync('toxic_api_dump.json', JSON.stringify(apiResponses, null, 2));
  console.log(`Saved ${apiResponses.length} API payloads to toxic_api_dump.json`);

  // Save the DOM data
  fs.writeFileSync('toxic_dom_dump.json', JSON.stringify(domGames, null, 2));
  console.log(`Saved ${domGames.length} DOM elements to toxic_dom_dump.json`);

  await browser.close();
  console.log("Scraping complete!");
})();
