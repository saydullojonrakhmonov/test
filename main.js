// main.js
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---- helpers -------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SCREENSHOT_DIR = path.join(__dirname, 'images');

// make sure the folder exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  console.log(`Created screenshot folder: ${SCREENSHOT_DIR}`);
}

// tiny utility to generate a unique filename
function screenshotPath(name = 'screenshot') {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')
    .join('_')
    .slice(0, -1);               // 2025-11-15_11-50-23
  return path.join(SCREENSHOT_DIR, `${name}_${timestamp}.png`);
}

// --------------------------------------------------------------
(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 450,
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(20000);

  await page.goto('http://localhost:5173/');

  const title = await page.title();
  console.log('Page title:', title);

  let isLoginSuccessful = false;

  if (title.includes('POS') || (await page.locator('#username').isVisible())) {
    console.log('Login form detected. Filling credentials...');

    await page.locator('#username').fill('super@2025');
    await page.locator('#password').fill('50L544k@');

    // Click login + wait for the next page
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.locator('button:has-text("Sign in")').click(),
    ]);

    // ---- Check if login was successful ----
    // Option 1: Check if URL changed (e.g., to dashboard)
    const afterLoginUrl = page.url();
    if (afterLoginUrl !== 'http://localhost:5173/') {
      isLoginSuccessful = true;
    }

    // Option 2: Check for a dashboard element (replace '#dashboard-element' with real selector)
    // e.g., if there's a welcome message or button after login
    // try {
    //   await page.waitForSelector('#dashboard-element', { timeout: 5000 });
    //   isLoginSuccessful = true;
    // } catch (e) {
    //   isLoginSuccessful = false;
    // }

    // Option 3: Check title changed
    // const afterTitle = await page.title();
    // if (afterTitle.includes('Dashboard')) {
    //   isLoginSuccessful = true;
    // }

    if (isLoginSuccessful) {
      console.log('Login successful!');
    } else {
      console.log('Login may have failed – check manually.');
    }

    // ---- take a screenshot after login ----
    const afterLoginPath = screenshotPath('after-login');
    await page.screenshot({ path: afterLoginPath, fullPage: true });
    console.log(`Screenshot saved: ${afterLoginPath}`);
  } else {
    console.log('Login form not found. Check selectors or page structure.');
  }

  // ---- Close the browser automatically ----
  // Wait 10 seconds (10000 ms) before closing – adjust as needed
  await new Promise(resolve => setTimeout(resolve, 10000));
  await browser.close();
  console.log('Browser closed.');

  // Log final status
  console.log(`Was login successful? ${isLoginSuccessful ? 'Yes' : 'No'}`);
})();