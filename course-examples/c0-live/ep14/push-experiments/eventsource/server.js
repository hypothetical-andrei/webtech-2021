const express = require('express')
const events = require('events')

const app = express()

let eventSource
const emitter = new events.EventEmitter()

emitter.on('update', () => {
  eventSource.write(`data: ${JSON.stringify({ evt: 'event://update', entity: 'resources' })}\n\n`)
})

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
  emitter.emit('update')
  res.status(201).json({ message: 'created' })
})

app.get('/resources', (req, res) => {
  res.status(200).json(app.locals.resources)
})

app.get('/event-source', (req, res) => { 
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive'
  })
  res.flushHeaders()
  res.write('retry: 10000\n\n')
  eventSource = res
})

app.listen(8080)
