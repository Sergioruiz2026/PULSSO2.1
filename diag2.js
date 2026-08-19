const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  try {
    console.log('NAVIGATING');
    const response = await page.goto('http://localhost:8000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('STATUS:', response && response.status());
    await page.waitForTimeout(3000);
    const root = await page.locator('#root').count();
    console.log('ROOT_COUNT:', root);
    const bodyText = await page.locator('body').innerText();
    console.log('BODY_LEN:', bodyText.length);
    console.log('BODY_SNIP:', bodyText.slice(0, 500));
    const rootHtml = await page.locator('#root').innerHTML();
    console.log('ROOT_HTML_LEN:', rootHtml.length);
    console.log('ROOT_HTML_SNIP:', rootHtml.slice(0, 400));
  } catch (e) {
    console.log('ERROR:', e && e.message);
  }
  await browser.close();
})();
