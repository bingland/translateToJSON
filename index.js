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

app.use(timeout(60000))
app.use(haltOnTimedout)

function haltOnTimedout(req, res, next){
  if (!req.timedout) next()
}

const langCodes = ['es', 'pt', 'fr', 'pl', 'de', 'nl', 'da', 'sv', 'no', 'et']
const langNames = ['Spanish', 'Portuguese', 'French', 'Polish', 'German', 'Dutch', 'Danish', 'Swedish', 'Norwegian', 'Estonian']

app.get('/languages', async (req, res) => {
  console.log('/languages')
  res.json(langCodes.map((code, i) => ({code: code, name: langNames[i]})))
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
    res.status(200).send(await t.translateAll(
    JSON.stringify(userJSON), 
    customSelector.replace(/\s/g, '').length !== 0 ? customSelector : '.VIiyi',
    selectedLangs
  ))} catch (e) {
    console.log(e)
    res.status(500).send({error: true, errorMessage: String(e)})
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
