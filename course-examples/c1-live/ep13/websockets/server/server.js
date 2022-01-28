var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

const cors = require('cors');

var uuidv4 = require('uuid').v4;

app.use(cors());

let rooms = {};
let chatLogs = {};

app.get('/room', function (req, res, next) {
	const room = {
		name: req.query.name,
		id: uuidv4()
	};
	rooms[room.id] = room;
	chatLogs[room.id] = [];
	res.json(room);
})

app.get('/room/:roomId', function (req, res, next) {
	const roomId = req.params.roomId;
	const response = {
		...rooms[roomId],
		chats: chatLogs[roomId]
	};
	res.json(response);
})

io.on('connection', function (socket) {
	socket.on('event://send-message', function(msg){
		console.log("got", msg);
		
		const payload = JSON.parse(msg);
		if (chatLogs[payload.roomId]) {
			if(chatLogs[payload.roomId]){
				chatLogs[payload.roomId].push(payload.data);
			}

			socket.broadcast.emit('event://get-message', msg);
		}
	})
})

http.listen(5000)