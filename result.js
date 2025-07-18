const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

module.exports = async (req, res) => {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://crickexnow.com/bd/bn/casino?vendor=evo', { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const el = document.querySelector('.result-box.active');
      return el ? el.textContent.trim() : 'Not Found';
    });

    await page.close();
    res.status(200).json({ result: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to scrape data' });
  } finally {
    if (browser) await browser.close();
  }
};