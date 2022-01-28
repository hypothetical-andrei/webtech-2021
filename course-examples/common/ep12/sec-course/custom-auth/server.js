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

app.post('/login', async (req, res) => {
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

app.get('/create', function (req, res) {
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

app.post('/users', function (req, res) {
  const user = req.body
  User.create(user)
    .then(function () {
      res.status(201).send('created')
    })
    .catch(function (err) {
      console.log(err)
    })
})
app.get('/test', function (req, res) {
  res.status(200).send('authenticated')
})

app.listen(8080)
