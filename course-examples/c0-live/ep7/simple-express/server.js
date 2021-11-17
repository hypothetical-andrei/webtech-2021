const express = require('express')

const app = express()

app.get('/', (req, res) => {
	res.status(200).send('ok')
})

app.listen(8080)