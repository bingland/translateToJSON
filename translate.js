const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

const translateAll = async (jsonString, selector) => {
  const browser = await puppeteer.launch({headless: true, dumpio: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const langCodes = ['es', 'pt', 'fr', 'pl', 'de', 'da', 'sv', 'et']
  const langNames = ['Spanish', 'Portuguese', 'French', 'Polish', 'German', 'Danish', 'Swedish', 'Estonian']
  let requestText = Object.values(JSON.parse(jsonString)).join('%0A').replace(/ /g,'%20')
  const page = await browser.newPage();
  console.log('Selector: ' + selector)
  let response = []
  for (let i in langCodes) {
    console.log('[Server] Currently reading: ' + langCodes[i])
    await page.goto(`https://translate.google.com/?sl=en&tl=${langCodes[i]}&text=${requestText}&op=translate`, {waitUntil: 'networkidle2'});
    await page.waitForSelector(selector)
    let data = await page.evaluate((selector) => {
      return document.querySelector(selector).innerText.split('\n')
    }, selector)
    let currentOutput = {}
    Object.keys(JSON.parse(jsonString)).forEach((key, i) => { currentOutput[key] = data[i] })
    response.push({langCode: langCodes[i], langName: langNames[i], translations: currentOutput})
    await delay(1500)
  }
  await browser.close(); 
  return response
}

module.exports.translateAll = translateAll
