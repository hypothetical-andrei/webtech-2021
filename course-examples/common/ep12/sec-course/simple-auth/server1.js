const express = require('express')

const app = express()

app.use((req, res, next) => {
  if (req.headers.authorization) {
    const encoded = req.headers.authorization.split(' ')[1]
    const decoded = Buffer.from(encoded, 'base64').toString('utf8')
    const [username, password] = decoded.split(':')
    if (username === 'admin' && password === 'supersecret') {
      next()
    } else {
      res.status(401).send('unauthorized')
    }
  } else {
    res.status(401).send('unauthorized')
  }
})

app.get('/test', (req, res) => {
  res.status(200).send('got it')
})

app.listen(8080)
