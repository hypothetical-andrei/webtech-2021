const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const NodeCache = require('node-cache')
const compression = require('compression')

const pasteCache = new NodeCache({ stdTTL: 1800, checkperiod: 120 })

const app = express()

app.set('view engine', 'ejs')

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.post('/pastes', (req, res) => {
	const key = uuidv4()
	pasteCache.set(key, req.body.content)
	res.redirect(`pastes/${key}`)
})

app.get('/pastes/:id', (req, res) => {
	const key = req.params.id
	const paste = pasteCache.get(key)
	if (paste) {
		res.render('pages/paste', { paste, key })
	} else {
		res.render('pages/404')
	}
})

app.get('/pastes/raw/:id', (req, res) => {
	const paste = pasteCache.get(req.params.id)
	if (paste) {
		res.status(200).set('Content-Type', 'text/plain').send(paste)
	} else {
		res.render('pages/404')
	}
})

app.listen(8080)