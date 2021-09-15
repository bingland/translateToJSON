const express = require('express')
const cors = require('cors')
const translate = require('./translate.js')

const app = express()
const port = process.env.PORT || 3535

// middlware 
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use("/", express.static(__dirname + '/public'));

app.get('/server', async (req, res) => {
  console.log('/server')
  res.send(await translate.translateAll())
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})