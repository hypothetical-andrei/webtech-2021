const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const Book = sequelize.define('book', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
})

const app = express()
app.use(bodyParser.json())

app.get('/sync', async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    res.status(201).json({ message: 'created' })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll()
    res.status(200).json(books)
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/books', async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === 'on') {
      await Book.bulkCreate(req.body)
      res.status(201).json({ message: 'created' })
    } else {
      await Book.create(req.body)
      res.status(201).json({ message: 'created' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      await book.update(req.body, { fields: ['title', 'content'] })
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      await book.destroy()
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.listen(8080)
