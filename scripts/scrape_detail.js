import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  let fullResponseJson = null;

  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'];
    
    // Catch the specific detail JSON API directly
    if (url.includes('/api/apps/get/') && contentType && contentType.includes('application/json')) {
      try {
        fullResponseJson = await response.json();
        console.log(`[Success] Intercepted exact game detail JSON from API: ${url}`);
      } catch (e) {
        console.error("Error reading JSON from response", e);
      }
    }
  });

  const url = 'https://toxicgame.net/download/pc/death-stranding-2-on-the-beach/69b9a1b4971be6666c60f436';
  console.log(`Navigating to ${url}...`);
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  console.log("Waiting 10 seconds for the React app to populate and load the API response...");
  await new Promise(r => setTimeout(r, 10000));

  if (fullResponseJson) {
    fs.writeFileSync('src/data/toxic_game_detail.json', JSON.stringify(fullResponseJson, null, 2));
    console.log("Successfully saved exact backend JSON API data to src/data/toxic_game_detail.json!");
  } else {
    console.log("Could not find the API response, attempting a complete DOM text dump...");
    const domData = await page.evaluate(() => {
      return {
        allText: document.body.innerText,
        allLinks: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href })),
        allImages: Array.from(document.querySelectorAll('img')).map(img => img.src)
      };
    });
    fs.writeFileSync('src/data/toxic_game_detail.json', JSON.stringify(domData, null, 2));
    console.log("Successfully saved full DOM dump to src/data/toxic_game_detail.json");
  }

  await browser.close();
  console.log("Done!");
})();
