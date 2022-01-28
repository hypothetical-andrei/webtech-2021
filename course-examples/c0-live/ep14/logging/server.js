const express = require('express')
const Sequelize = require('sequelize')

const monolog = require('monolog')
const Logger = monolog.Logger
const StreamHandler = monolog.handler.StreamHandler
const ConsoleLogHandler = monolog.handler.ConsoleLogHandler

const log = new Logger('server')
log.pushHandler(new StreamHandler(`${process.cwd()}/server.log`, Logger.DEBUG))
log.pushHandler(new ConsoleLogHandler(Logger.DEBUG))

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
app.use((req, res, next) => {
  log.info(`${req.method} : ${req.url}`)
  next()
})

app.use(express.json())

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


app.listen(8080)