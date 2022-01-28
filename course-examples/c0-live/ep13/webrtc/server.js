const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)

const io = socketIO.listen(server)

io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
    socket.broadcast.emit('message', message)
  })

  socket.on('create or join', function (room) {
    const clientsInRoom = io.sockets.adapter.rooms[room]
    const numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0

    if (numClients === 0) {
      console.warn('create')
      socket.join(room)
      socket.emit('created', room, socket.id)
    } else if (numClients === 1) {
      console.warn('join')
      socket.join(room)
      socket.emit('joined', room, socket.id)
      io.sockets.in(room).emit('ready', room)
      socket.broadcast.emit('ready', room)
    } else {
      socket.emit('full', room)
    }
  })

  socket.on('disconnect', function (reason) {
    socket.broadcast.emit('bye')
  })
})

server.listen(8080)
