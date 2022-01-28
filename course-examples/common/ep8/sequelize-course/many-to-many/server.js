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

const Message = sequelize.define('message', {
  title: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      len: [3, 100]
    }
  },
  date: {
    allowNull: false,
    defaultValue: Sequelize.NOW,
    type: Sequelize.DATE
  },
  content: {
    allowNull: false,
    type: Sequelize.TEXT,
    validate: {
      len: [10, 1000]
    }
  }
})

const Author = sequelize.define('author', {
  name: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      len: [3, 100]
    }
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  }
})

Message.belongsToMany(Author, { through: 'author_message' })
Author.belongsToMany(Message, { through: 'author_message' })

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

app.get('/authors', async (req, res, next) => {
  try {
    // const authors = await Author.findAll({ include: Message })
    const [authors, meta] = await sequelize.query('select * from authors')
    res.status(200).json(authors)
  } catch (e) {
    next(e)
  }
})

app.post('/authors', async (req, res, next) => {
  try {
    await Author.create(req.body)
    res.status(201).json({ message: 'created' })
  } catch (e) {
    next(e)
  }
})

app.get('/authors/:id', async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id, { include: [Message] })
    if (author) {
      res.status(200).json(author)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    next(e)
  }
})

app.get('/authors/:id/messages', async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id)
    if (author) {
      const messages = await author.getMessages()
      res.status(200).json(messages)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    next(e)
  }
})

app.post('/authors/:id/messages', async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id)
    const message = await Message.create(req.body)
    author.addMessage(message)
    res.status(200).json({ message: 'created' })
  } catch (e) {
    next(e)
  }
})

app.get('/messages/:id/authors', async (req, res, next) => {
  try {
    const message = await Message.findByPk(req.params.id)
    if (message) {
      const authors = await message.getAuthors()
      res.status(200).json(authors)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    next(e)
  }
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error')
})

app.listen(8080)
