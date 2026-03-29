import { chromium } from 'playwright';

try {
  const browser = await chromium.launch({ 
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://beige-geckos-shake.loca.lt', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Title:', await page.title());
  await page.screenshot({ path: 'C:/Users/23823/.qclaw/workspace/screenshot-home.png' });
  console.log('Screenshot saved');
  await browser.close();
} catch(e) {
  console.log('Error:', e.message);
}
