'use strict'
const express = require('express')
const Sequelize = require('sequelize')
const moment = require('moment')
const crypto = require('crypto')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'auth.db'
})
const User = sequelize.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  token: Sequelize.STRING,
  expiry: Sequelize.DATE
})

const app = express()

app.use(express.json())

const authRouter = express.Router()
const apiRouter = express.Router()
const adminRouter = express.Router()

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

apiRouter.use(async (req, res, next) => {
  const token = req.headers.auth
  try {
    const user = await User.findOne({ token: token })
    if (!user) {
      res.status(401).send('unauthorized')
    } else {
      if (moment().diff(user.expiry, 'seconds') < 0) {
        next()
      } else {
        res.status(401).send('token expired')
      }
    }
  } catch (e) {
    res.status(500).send('server error')
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const credentials = req.body
    let token
    const user = await User.find({
      where: {
        username: credentials.username,
        password: credentials.password
      }
    })
    if (user) {
      user.expiry = moment().add(60, 'seconds')
      token = crypto.randomBytes(64).toString('hex')
      user.token = token
      await user.save()
      res.status(200).send({ token: token })
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
