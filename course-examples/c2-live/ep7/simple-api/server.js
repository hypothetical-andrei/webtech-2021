const express = require('express')
const bodyParser = require('body-parser')
const widgetRouter = require('./widget-router')

const app = express()

app.locals.widgets = [{
	id: 1,
	description: 'some description'
}, {
	id: 2,
	description: 'some other description'
}]

app.use((req, res, next) => {
	console.log('Requested ' + req.url)
	next()
})

const pingMiddleware = (req, res, next) => {
	console.log('i have been pinged')
	next()
}

app.use(bodyParser.json())

app.use('/widget-api', widgetRouter)

app.get('/ping', pingMiddleware, (req, res) => {
	res.status(200).json({ message: 'pong' })
})

app.get('/error', (req, res, next) => {
	try {
		if (req.query.trigger === 'on') {
			throw new Error('some error')
		} else {
			res.status(200).send('no error')
		}
	} catch (err) {
		next(err)
	}
})

app.use((err, req, res, next) => {
	console.warn(err)
	res.status(500).json({ message: 'some server error' })	
})

app.listen(8080)