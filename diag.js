const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('requestfailed', req => console.log('REQUESTFAILED:', req.url(), req.failure()?.errorText));
  console.log('NAVIGATING');
  const response = await page.goto('http://localhost:8000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('STATUS:', response && response.status());
  console.log('TITLE:', await page.title());
  console.log('ROOTCOUNT:', await page.locator('#root').count());
  console.log('BODY:', (await page.locator('body').innerText()).slice(0, 1200));
  await browser.close();
})();
