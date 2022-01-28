'use strict'
const express = require('express')
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'auth.db'
})

const User = sequelize.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  key: Sequelize.STRING
})

const app = express()

app.use(express.json())

const authRouter = express.Router()
const apiRouter = express.Router()
const adminRouter = express.Router()

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

apiRouter.use((req, res, next) => {
  if (req.headers.auth && req.headers.auth === 'somekey') {
    next()
  } else {
    res.status(401).send('unauthorized')
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const credentials = req.body
    const user = await User.find({
      where: {
        username: credentials.username,
        password: credentials.password
      }
    })
    if (user) {
      res.status(200).send('login successful')
    } else {
      res.status(401).send('invalid credentials')
    }
  } catch (e) {
    res.status(500).send('server error')
  }
})

adminRouter.get('/create', function (req, res) {
  sequelize
    .sync({
      force: true
    })
    .then(function () {
      res.status(200).send('ok')
    })
    .catch(function (err) {
      console.log('An error occurred while creating the table:', err)
    })
})

adminRouter.post('/users', function (req, res) {
  const user = req.body
  User.create(user)
    .then(function () {
      res.status(201).send('created')
    })
    .catch(function (err) {
      console.log(err)
    })
})

apiRouter.get('/test', function (req, res) {
  res.status(200).send('you are in the api')
})

app.listen(8080)
