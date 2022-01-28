require('dotenv').config({ path: './server.env' })

const http = require('http')
const https = require('https')
const fs = require('fs')

const privateKey = fs.readFileSync('certs/key.pem', 'utf8')
const certificate = fs.readFileSync('certs/cert.pem', 'utf8')

const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: process.env.SSL_PASSPHRASE
}

const express = require('express')
const app = express()

app.get('*', (req, res, next) => {
  if (req.protocol !== 'https') {
    res.redirect(`https://${req.headers.host.split(':')[0] + ':8443' + req.url}`)
  } else {
    next()
  }
})

app.get('/ping', (req, res) => {
  res.status(200).send({ message: 'pong' })
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)

httpServer.listen(8080)
httpsServer.listen(8443)
