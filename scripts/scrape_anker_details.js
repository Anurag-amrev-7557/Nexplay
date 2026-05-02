import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  console.log("[AnkerGames] Initializing detailed modal scraper for download links...");

  if (!fs.existsSync('src/data/anker_categories.json')) {
    console.error("No anker_categories.json found to scrape details for.");
    await browser.close();
    return;
  }

  let allData = JSON.parse(fs.readFileSync('src/data/anker_categories.json', 'utf8'));
  const uniqueUrls = new Set();
  const tasks = [];

  // Gather tasks from categories
  Object.keys(allData).forEach(cat => {
    if (Array.isArray(allData[cat])) {
      allData[cat].forEach(game => {
        if (game.href && !uniqueUrls.has(game.href)) {
          uniqueUrls.add(game.href);
          tasks.push(game);
        }
      });
    }
  });

  console.log(`[AnkerGames] Found ${tasks.length} unique games.`);

  // Let's specifically scrape the first 8 unique games
  const gamesToScrape = tasks.slice(0, 8);

  for (let i = 0; i < gamesToScrape.length; i++) {
    const game = gamesToScrape[i];
    console.log(`\n[AnkerGames] [${i + 1}/${gamesToScrape.length}] Scraping details for: ${game.title}`);

    try {
      await page.goto(game.href, { waitUntil: 'networkidle2', timeout: 35000 });
      await new Promise(r => setTimeout(r, 6000));

      // Locate and click the download button to trigger the modal
      const modalTriggered = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        const dlBtn = btns.find(b => {
          const txt = (b.innerText || '').toLowerCase();
          return txt.includes('download') || txt.includes('get game') || txt.includes('direct download');
        });

        if (dlBtn) {
          dlBtn.scrollIntoView({ block: 'center' });
          dlBtn.click();
          return true;
        }
        return false;
      });

      if (modalTriggered) {
        console.log(`[AnkerGames] Clicked download button to trigger links modal.`);
        await new Promise(r => setTimeout(r, 4500));
      }

      const details = await page.evaluate(() => {
        // Find links in any modal or overall page content
        const allAnchors = Array.from(document.querySelectorAll('a')).map(a => ({
          text: (a.innerText || '').trim(),
          href: a.href || ''
        }));

        // Filter valid download/mirrors
        const filteredLinks = allAnchors.filter(l => {
          if (!l.href || l.href.startsWith('#') || l.href.includes('javascript:')) return false;
          if (l.href.includes('ankergames.net/games-list') || l.href.includes('ankergames.net/trending') || l.href.includes('ankergames.net/collections')) return false;
          if (l.href.includes('/tag/') || l.href.includes('/category/')) return false;
          return true;
        }).map(l => l.href);

        // Capture system requirements from text
        const reqList = Array.from(document.querySelectorAll('ul li, div.requirements p, div p')).map(p => p.innerText.trim()).filter(Boolean);
        const os = reqList.find(r => r.toLowerCase().includes('windows') || r.toLowerCase().includes('os')) || 'Windows 10 64-bit';
        const processor = reqList.find(r => r.toLowerCase().includes('intel') || r.toLowerCase().includes('amd')) || 'Intel Core i5';
        const memory = reqList.find(r => r.toLowerCase().includes('ram') || r.toLowerCase().includes('gb')) || '16 GB RAM';

        return {
          description: reqList.slice(0, 4).join('\n\n'),
          systemRequirements: {
            os,
            processor,
            memory,
            graphics: 'DirectX 12 Compatible',
            storage: '80 GB available space'
          },
          downloadLink: filteredLinks.length > 0 ? filteredLinks : [window.location.href],
          size: '60 GB'
        };
      });

      console.log(`[AnkerGames] Found ${details.downloadLink.length} clickable download/mirrors links from the modal.`);
      
      // Update game everywhere it exists in all categories
      Object.keys(allData).forEach(cat => {
        if (Array.isArray(allData[cat])) {
          allData[cat].forEach(g => {
            if (g.href === game.href) {
              g.description = details.description;
              g.systemRequirements = details.systemRequirements;
              g.downloadLink = details.downloadLink;
              g.size = details.size;
            }
          });
        }
      });

    } catch (error) {
      console.error(`[AnkerGames] Error scraping:`, error.message);
    }
  }

  // Save the updated categories
  fs.writeFileSync('src/data/anker_categories.json', JSON.stringify(allData, null, 2));
  console.log(`\n[AnkerGames] Saved updated game details from modal successfully!`);

  await browser.close();
})();
