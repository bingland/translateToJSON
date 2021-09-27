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

app.post('/server', async (req, res) => {
  console.log(req.body)
  let { userJSON, customSelector } = req.body
  try { // check if json is valid
    JSON.parse(JSON.stringify(userJSON))
  } catch (e) {
    console.log(e)
    res.send('Error')
  }
  console.log('POST /server')
  try { res.send(await t.translateAll(
    JSON.stringify(userJSON), 
    customSelector.replace(/\s/g, '').length !== 0 ? customSelector : '.VIiyi')
  )} catch (e) {
    console.log(e)
    res.send('Error')
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
