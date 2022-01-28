const express = require('express')
const ws = require('ws')

const app = express()

const wsServer = new ws.Server({ noServer: true })

app.locals.resources = [{
  id: 1,
  content: 'first'
}, {
  id: 2,
  content: 'second'
}]

app.use(express.static('public'))
app.use(express.json())

app.get('/trigger', (req, res) => {
  app.locals.resources.push({
    id: 3,
    content: 'third'
  })
  wsServer.clients.forEach(e=> e.send(JSON.stringify({ evt: 'event://update', entity: 'resources' })))
  res.status(201).json({ message: 'created' })
})

app.get('/resources', (req, res) => {
  res.status(200).json(app.locals.resources)
})

const server = app.listen(8080)

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

