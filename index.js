const express = require('express')
const cors = require('cors')
const t = require('./translate.js')

const app = express()
const port = process.env.PORT || 3535

// middlware 
app.use(cors())
app.use(express.json())
app.use("/", express.static(__dirname + '/public'));

app.post('/server', async (req, res) => {
  console.log(req.body)
  // check if json is valid
  try { 
    JSON.parse(JSON.stringify(req.body))
  } catch (e) {
    console.log(e)
    return 
  }
  console.log('/server')
  res.send(await t.translateAll(JSON.stringify(req.body)))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
