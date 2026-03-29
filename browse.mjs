import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://bdce73cf33d64f30-123-113-78-55.serveousercontent.com/cms');
await page.waitForLoadState('networkidle');
const title = await page.title();
console.log('Title:', title);
const html = await page.content();
console.log('HTML length:', html.length);
// Get visible text from body
const bodyText = await page.locator('body').innerText();
console.log('Body text (first 500):', bodyText.slice(0, 500));
// Check for key elements
const header = await page.locator('header').count();
const main = await page.locator('main').count();
console.log('Has header:', header > 0, 'Has main:', main > 0);
await browser.close();
