require('dotenv').config({})
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const path = require('path')

let sequelize

if (process.env.NODE_ENV === 'development') {
  sequelize = new Sequelize({
  	dialect: 'sqlite',
  	storage: 'sample.db'
  })  
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
}

const Book = sequelize.define('book', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
})

const Chapter = sequelize.define('chapter', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
})

Book.hasMany(Chapter)

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cors())
app.use(express.json())

// app.get('/sync', async (req, res) => {
//   try {
//     await sequelize.sync({ force: true })
//     res.status(201).json({ message: 'created' })
//   } catch (e) {
//     console.warn(e)
//     res.status(500).json({ message: 'server error' })
//   }
// })

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
    const book = await Book.findByPk(req.params.id, { include: Chapter })
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

app.get('/books/:bid/chapters', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bid)
    if (book) {
      const chapters = await book.getChapters()

      res.status(200).json(chapters)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/books/:bid/chapters/:cid', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bid)
    if (book) {
      const chapters = await book.getChapters({ where: { id: req.params.cid } })
      res.status(200).json(chapters.shift())
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/books/:bid/chapters', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bid)
    if (book) {
      const chapter = req.body
      chapter.bookId = book.id
      console.warn(chapter)
      await Chapter.create(chapter)
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/books/:bid/chapters/:cid', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bid)
    if (book) {
      const chapters = await book.getChapters({ where: { id: req.params.cid } })
      const chapter = chapters.shift()
      if (chapter) {
        await chapter.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/books/:bid/chapters/:cid', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bid)
    if (book) {
      const chapters = await book.getChapters({ where: { id: req.params.cid } })
      const chapter = chapters.shift()
      if (chapter) {
        await chapter.destroy(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.listen(process.env.PORT, async () => {
  await sequelize.sync({ alter: true })
})