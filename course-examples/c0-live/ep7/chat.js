const net = require('net')

const server = net.createServer()
const clients = []

server.on('connection', (client) => {
	client.write('welcome to the chat server !\n')
	clients.push(client)

	client.on('data', (data) => {
		for (let i = 0; i < clients.length; i++) {
			if (clients[i] !== client) {
				clients[i].write(data)
			}
		}
	})

	client.on('end', () => {
		clients.splice(clients.indexOf(client), 1)
	})
})

server.listen(3333)