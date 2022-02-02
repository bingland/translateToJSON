const puppeteer = require('puppeteer')

const delay = ms => new Promise(res => setTimeout(res, ms))

const translateAll = async (jsonString, selector, selectedLangs) => {
  const browser = await puppeteer.launch({headless: true, dumpio: true, args: ['--no-sandbox', '--disable-setuid-sandbox']})
  const langNames = [
    {name: 'Spanish', code: 'es'}, 
    {name: 'Portuguese', code: 'pt'},
    {name: 'French', code: 'fr'},
    {name: 'Polish', code: 'pl'},
    {name: 'German', code: 'de'},
    {name: 'Dutch', code: 'nl'},
    {name: 'Danish', code: 'da'},
    {name: 'Swedish', code: 'sv'},
    {name: 'Norwegian', code: 'no'},
    {name: 'Estonian', code: 'et'},
  ]
  let requestText = (Object.values(JSON.parse(jsonString)).map(item => encodeURIComponent(item)).join('%0A').replace(/ /g,'%20'))
  const page = await browser.newPage()
  let response = []
  for (let i in selectedLangs) {
    console.log('[Server] Currently reading: ' + selectedLangs[i])
    await page.goto(`https://translate.google.com/?sl=en&tl=${selectedLangs[i]}&text=${requestText}&op=translate`, {waitUntil: 'networkidle2'});
    await page.waitForSelector(selector)
    let data = await page.evaluate((selector) => {
      return document.querySelector(selector).innerText.split('\n')
    }, selector)
    let currentOutput = {}
    Object.keys(JSON.parse(jsonString)).forEach((key, i) => { currentOutput[key] = data[i] })
    response.push({langCode: selectedLangs[i], langName: langNames[langNames.findIndex(el => el.code === selectedLangs[i])].name, translations: currentOutput})
    await delay(1200)
  }
  await browser.close()
  console.log(`Process completed. Got data for ${selectedLangs && selectedLangs.length} item(s)`)
  return response
}

module.exports.translateAll = translateAll
