import puppeteer from "puppeteer";

const url = process.argv[2] || "https://karniexim.com";
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0" });
const scripts = await page.$$eval('script[type="application/ld+json"]', nodes => nodes.map(n => n.textContent));
console.log('Found', scripts.length, 'JSON-LD scripts');
const script = scripts[0];
console.log(script.slice(-200));
try {
  JSON.parse(script);
  console.log('Parse success');
} catch (err) {
  console.error('Parse error:', err.message);
}
await browser.close();