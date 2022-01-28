const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(server)

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
  io.local.emit('event://reload')
  res.status(201).json({ message: 'created' })
})

app.get('/resources', (req, res) => {
  res.status(200).json(app.locals.resources)
})

server.listen(8080)
