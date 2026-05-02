import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

const ENDPOINTS = [];

// Dynamically populate Mac games (Pages 1 to 14)
for (let pageNum = 1; pageNum <= 14; pageNum++) {
  ENDPOINTS.push({
    url: `https://toxicgame.net/category/mac/games${pageNum > 1 ? `?page=${pageNum}` : ''}`,
    name: 'mac_games'
  });
}

// Dynamically populate PC games (Pages 1 to 3)
for (let pageNum = 1; pageNum <= 3; pageNum++) {
  ENDPOINTS.push({
    url: `https://toxicgame.net/category/pc/games${pageNum > 1 ? `?page=${pageNum}` : ''}`,
    name: 'pc_games'
  });
}

// Additional categories
ENDPOINTS.push({ url: 'https://toxicgame.net/category/mac/softwares', name: 'mac_softwares' });
ENDPOINTS.push({ url: 'https://toxicgame.net/category/ps2/iso', name: 'ps2_iso' });
ENDPOINTS.push({ url: 'https://toxicgame.net/category/ps3/iso', name: 'ps3_iso' });

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  console.log(`[ToxicGame] Initializing deeper 14-page scraper for Mac and PC categories...`);

  // Load existing data to merge and prevent losing other categories
  let allData = {};
  if (fs.existsSync('src/data/toxic_categories.json')) {
    try {
      allData = JSON.parse(fs.readFileSync('src/data/toxic_categories.json', 'utf8'));
      console.log("[ToxicGame] Loaded existing data. Merging new pages into it.");
    } catch (e) {
      console.error("[ToxicGame] Failed to parse existing toxic_categories.json", e);
    }
  }

  let currentCategory = "";
  
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json') && url.includes('/api/apps/category/')) {
      try {
        const json = await response.json();
        if (json && json.apps && currentCategory) {
          const formatted = json.apps.map(game => ({
            _id: game._id,
            title: game.title,
            price: game.price === 0 ? "Free" : `₹${game.price}`,
            image: game.coverImg || (game.thumbnail && game.thumbnail[0]) || "",
            platform: game.platform || "Unknown",
            source: "ToxicGame",
            description: game.description || "",
            details: game.details || {},
            systemRequirements: game.systemRequirements || {},
            downloadLink: game.downloadLink || [],
            tags: game.tags || [],
            size: game.size || "",
            thumbnail: game.thumbnail || []
          }));
          
          if (!allData[currentCategory]) allData[currentCategory] = [];
          
          let addedCount = 0;
          formatted.forEach(g => {
            if (!allData[currentCategory].find(ag => ag.title === g.title)) {
              allData[currentCategory].push(g);
              addedCount++;
            }
          });
          
          console.log(`[ToxicGame] Intercepted category API. Appended ${addedCount} new unique items to ${currentCategory}.`);
        }
      } catch (e) {}
    }
  });

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    currentCategory = endpoint.name;
    console.log(`\n[ToxicGame] [${i + 1}/${ENDPOINTS.length}] Navigating to ${endpoint.url}...`);
    
    await page.goto(endpoint.url, { waitUntil: 'networkidle2' });
    
    if (i === 0) await new Promise(r => setTimeout(r, 10000));
    else await new Promise(r => setTimeout(r, 4500));
  }

  fs.writeFileSync('src/data/toxic_categories.json', JSON.stringify(allData, null, 2));
  console.log(`\n[ToxicGame] Saved complete categorized database to src/data/toxic_categories.json!`);

  await browser.close();
})();
