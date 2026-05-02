import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const ENDPOINTS = [
  { url: 'https://ankergames.net/games-list', name: 'games_list' },
  { url: 'https://ankergames.net/top-games', name: 'top_games' },
  { url: 'https://ankergames.net/trending', name: 'trending' },
  { url: 'https://ankergames.net/collections', name: 'collections' }
];

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  console.log("[AnkerGames] Initializing categorized crawler...");
  
  const allData = {};

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    console.log(`\n[AnkerGames] Navigating to ${endpoint.url}...`);
    
    await page.goto(endpoint.url, { waitUntil: 'networkidle2' });
    
    // Wait for Cloudflare on first load, then just wait for DOM on subsequent
    if (i === 0) await new Promise(r => setTimeout(r, 8000));
    else await new Promise(r => setTimeout(r, 2000));

    const games = await page.evaluate(() => {
      const results = [];
      const links = Array.from(document.querySelectorAll('a'));
      links.forEach(link => {
        if (!link.href.includes('/game/') && !link.href.includes('/collection/')) return;
        
        const img = link.querySelector('img');
        if (img && img.src && img.src.startsWith('http')) {
          results.push({
            title: img.alt || link.innerText.trim(),
            image: img.src,
            href: link.href
          });
        }
      });
      return results;
    });
    
    // Deduplicate
    const uniqueGames = [];
    games.forEach(g => {
      if (g.title.length > 2 && !uniqueGames.find(ag => ag.title === g.title)) {
        uniqueGames.push({
          title: g.title,
          price: "Free",
          image: g.image,
          platform: "PC",
          source: "AnkerGames"
        });
      }
    });
    
    allData[endpoint.name] = uniqueGames;
    console.log(`[AnkerGames] Found ${uniqueGames.length} items for ${endpoint.name}.`);
  }

  fs.writeFileSync('src/data/anker_categories.json', JSON.stringify(allData, null, 2));
  console.log(`\n[AnkerGames] Successfully saved data to src/data/anker_categories.json!`);

  await browser.close();
})();
