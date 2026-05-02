import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  console.log("[AnkerGames] Navigating to https://ankergames.net/games-list...");
  await page.goto('https://ankergames.net/games-list', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Give it a moment to clear security and settle
  await new Promise(r => setTimeout(r, 8000));

  console.log("[AnkerGames] Attempting to click 'Load More' button up to 120 times to fetch ALL available games...");
  
  for (let i = 0; i < 120; i++) {
    const clicked = await page.evaluate(() => {
      // Find buttons containing text like "Load More" or similar selectors
      const buttons = Array.from(document.querySelectorAll('button, a, div'));
      const loadMoreBtn = buttons.find(b => {
        const txt = (b.innerText || '').toLowerCase();
        return txt.includes('load more') || txt.includes('more games') || txt.includes('next');
      });

      if (loadMoreBtn && loadMoreBtn.style.display !== 'none' && !loadMoreBtn.disabled) {
        loadMoreBtn.scrollIntoView({ block: 'center' });
        loadMoreBtn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log(`[AnkerGames] Clicked 'Load More' button (Attempt ${i + 1}/120).`);
      // Wait for content to load
      await new Promise(r => setTimeout(r, 1800));
    } else {
      console.log("[AnkerGames] No more 'Load More' button found.");
      break;
    }
  }

  // Robust parsing of all elements
  const games = await page.evaluate(() => {
    const results = [];
    const links = Array.from(document.querySelectorAll('a'));
    links.forEach(link => {
      const href = link.href || '';
      // Support various URL variations for ankergames
      if (!href.includes('/game') && !href.includes('/collection') && !href.includes('/download')) return;
      
      const img = link.querySelector('img');
      let src = '';
      if (img) {
        src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('srcset') || '';
      }
      
      const title = img?.alt || link.innerText.trim() || link.querySelector('h1, h2, h3, h4, h5, p, span')?.innerText?.trim() || 'Awesome Game';
      
      if (title && title.length > 2) {
        results.push({
          title: title,
          image: src || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
          href: href
        });
      }
    });
    return results;
  });

  console.log(`[AnkerGames] Scraped a total of ${games.length} games with robust extraction.`);

  // Load existing anker_categories to append to or initialize
  let allData = { games_list: [], top_games: [], trending: [], collections: [] };
  if (fs.existsSync('src/data/anker_categories.json')) {
    try {
      allData = JSON.parse(fs.readFileSync('src/data/anker_categories.json', 'utf8'));
    } catch (e) {}
  }

  // Deduplicate and map
  const uniqueGames = [];
  games.forEach(g => {
    if (g.title.length > 2 && !uniqueGames.find(ag => ag.title === g.title)) {
      uniqueGames.push({
        title: g.title,
        price: "Free",
        image: g.image,
        platform: "PC",
        source: "AnkerGames",
        href: g.href
      });
    }
  });

  allData.games_list = uniqueGames;

  fs.writeFileSync('src/data/anker_categories.json', JSON.stringify(allData, null, 2));
  console.log(`[AnkerGames] Successfully saved ${uniqueGames.length} full unique items to src/data/anker_categories.json!`);

  await browser.close();
})();
