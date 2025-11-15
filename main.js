// main.js
import { chromium } from 'playwright';

(async () => {
  // Launch Chromium – headed, maximized, slow motion
  const browser = await chromium.launch({
    headless: false,
    slowMo: 450,
    args: ['--start-maximized'],
  });

  // Context without a fixed viewport → --start-maximized works
  const context = await browser.newContext({ viewport: null });

  // New page
  const page = await context.newPage();

  // 20-second default timeouts
  page.setDefaultNavigationTimeout(20000);
  page.setDefaultTimeout(20000);

  // Go to the site
  await page.goto('https://kassa-dev.smartpos.uz');

  // **Await** the title
  const title = await page.title();
  console.log('Page title:', title);

  console.log('Browser is open – close it manually or press Ctrl+C.');
  await new Promise(() => {});               // keep the script alive
})();