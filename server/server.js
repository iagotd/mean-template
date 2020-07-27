const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const cors = require('cors')

const api = require('./routes/api')
const app = express()
const port = 8443

app.use(cors())
app.use(bodyParser.json())
app.use('/api', api)

const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('Server running at ' + port)
    })