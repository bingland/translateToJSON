const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false, dumpio: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  let jsonString = `{
    "firstThing": "Hello world!",
    "secondThing": "I am translating!"
  }`
  let requestText = Object.values(JSON.parse(jsonString)).join('%0A').replace(/ /g,'%20')
  console.log(requestText)
  const page = await browser.newPage();
  await page.goto(`https://translate.google.com/?sl=en&tl=fr&text=${requestText}&op=translate`, {waitUntil: 'networkidle2'});
  
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

  await page.screenshot({ path: './screenshots/example.png' }); 

  await browser.close(); 
})();