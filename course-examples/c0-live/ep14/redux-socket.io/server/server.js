const express = require('express')
const app = express()
const http = require('http')

const httpServer = http.createServer(app)
const { Server } = require('socket.io', {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: false,
    transports: ['websocket']
  },
  allowEIO3: true
})

const cors = require('cors')
const uuidv4 = require('uuid').v4

app.locals.rooms = {}

app.use(cors())
app.use(express.static('build'))

app.get('/rooms', function (req, res, next) {
  const room = {
    name: req.query.name,
    id: uuidv4(),
    logs: []
  }
  app.locals.rooms[room.id] = room
  res.status(200).json(room)
})

app.get('/rooms/:rid', function (req, res, next) {
  const roomId = req.params.rid
  const room = app.locals.rooms[roomId]
  res.json(room)
})

httpServer.listen(8080, () => {
  console.log('listening on *:8080')
})

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  socket.on('event://send-message', (message) => {
    console.warn(message)
    const payload = JSON.parse(message)
    const room = app.locals.rooms[payload.roomId]
    if (room) {
      const id = uuidv4()
      app.locals.rooms[payload.roomId].logs.push({ ...payload.data, id })
      socket.broadcast.emit('event://get-message', JSON.stringify({ ...payload.data, id }))
    }
  })
})
