"use strict"

const express = require('express')
const timeout = require('connect-timeout')
const cors = require('cors')
const t = require('./translate.js')

const app = express()
const port = process.env.PORT || 3535

// middlware 
app.use(cors())
app.use(express.json())
app.use("/", express.static(__dirname + '/public'));

// app.use(timeout(60000))
// app.use(haltOnTimedout)

function haltOnTimedout(req, res, next){
  if (!req.timedout) next()
}

const langData = [
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
  {name: 'Italian', code: 'it'},
  {name: 'Lithuanian', code: 'lt'},
  {name: 'Arabic', code: 'ar', loto: true},
  {name: 'Hebrew', code: 'iw', loto: true},
  {name: 'Italian', code: 'it', loto: true},
  {name: 'Korean', code: 'ko', loto: true},
  {name: 'Chinese', code: 'zh-CN', loto: true},
]

const langCodes = langData.map(lang => lang.code)
const langNames = langData.map(lang => lang.name)

app.get('/languages', async (req, res) => {
  console.log('/languages')
  res.json(langCodes.map((code, i) => ({code: code, name: langNames[i], loto: langData[i].loto})))
})

app.post('/server', async (req, res) => {
  console.log('POST /server')
  console.log(req.body)
  let { userJSON, customSelector, selectedLangs } = req.body
  try { // check if json is valid
    JSON.parse(JSON.stringify(req.body))
    JSON.parse(JSON.stringify(userJSON))
  } catch (e) {
    console.log(e)
    res.status(500).send({error: true, message: String(e)})
  }
  try {
    const translateAllReturn = await t.translateAll(
      JSON.stringify(userJSON), 
      customSelector.replace(/\s/g, '').length !== 0 ? customSelector : '.lRu31',
      selectedLangs
    )
    res.status(200).send(translateAllReturn)
  } catch (e) {
    console.log(e)
    res.status(500).send({error: true, errorMessage: String(e)})
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
