import puppeteer from 'puppeteer';

const test = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('requestfailed', request => {
    console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });
  page.on('response', response => {
    if (response.url().includes('departments')) {
      console.log(`DEPARTMENTS RESPONSE: ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle0' });
  
  const options = await page.$$eval('select[name="department"] option', opts => opts.map(o => o.textContent));
  console.log("Dropdown Options Found:", options);
  
  await browser.close();
};

test();
