const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({headless: true, dumpio: true, args: ['--no-sandbox']});
  const langCodes = ['es', 'pt', 'fr', 'pl', 'de', 'da', 'sv', 'et']
  let jsonString = `{
    "firstThing": "Hello world!",
    "secondThing": "I am translating!"
  }`
  let requestText = Object.values(JSON.parse(jsonString)).join('%0A').replace(/ /g,'%20')
  const page = await browser.newPage();

  for (let i in langCodes) {
    console.log('Language: ' + langCodes[i])

    await page.goto(`https://translate.google.com/?sl=en&tl=${langCodes[i]}&text=${requestText}&op=translate`, {waitUntil: 'networkidle2'});
  
    await page.waitForSelector('.VIiyi')
    let data = await page.evaluate(() => {
      let translationData = document.querySelector('.VIiyi').innerText.split('\n')
      return translationData
    })
    console.log(data)
    let output = {}
    Object.keys(JSON.parse(jsonString)).forEach((key, i) => {
      output[key] = data[i]
    })
    console.log(output)
    await delay(1000)
  }

  // await page.screenshot({ path: './screenshots/example.png' }); 
  await browser.close(); 
})();
