import puppeteer from 'puppeteer';

async function testFrontend() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:5173/verify-email/742f6ac3e90543bacc60d231223718a0b08e0a7e63aa926d719b95fb0b3e6710', { waitUntil: 'networkidle0' });
  
  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log('HTML CONTENT:', html.substring(0, 500));
  await browser.close();
}
testFrontend();
