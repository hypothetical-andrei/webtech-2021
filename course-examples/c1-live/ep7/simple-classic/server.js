const express = require('express')
const session = require('express-session')

const app = express()
app.set('view engine', 'pug')
app.use(session({secret : 'really secret secret'}))

app.get('/', (req, res) => {
	const session = req.session
	session.someData = 'random stuff'

	res.render('index', { title: 'some title', message: 'some message' })
})

app.get('/next', (req, res) => {
	const session = req.session
	res.render('next', { state: session.someData })
})

app.listen(8080)