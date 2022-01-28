const express = require('express')
const app = express()
const http = require('http').createServer(app)

const io = require('socket.io')(http)

const cors = require('cors')
const uuidv4 = require('uuid').v4

app.locals.rooms = {}

app.use(cors())

app.get('/room', function (req, res, next) {
  const room = {
    name: req.query.name,
    id: uuidv4(),
    logs: []
  }
  app.locals.rooms[room.id] = room
  res.status(200).json(room)
})

app.get('/room/:rid', function (req, res, next) {
  const roomId = req.params.rid
  const room = app.locals.rooms[roomId]
  res.json(room)
})

io.on('connection', (socket) => {
  socket.on('event://send-message', (message) => {
    console.warn(message)
    const payload = JSON.parse(message)
    const room = app.locals.rooms[payload.roomId]
    if (room) {
      app.locals.rooms.logs.push(payload.data)
    }
    socket.broadcast.emit('event://get-message', message)
  })
})

http.listen(5000, () => {
  console.log('listening on *:5000')
})
