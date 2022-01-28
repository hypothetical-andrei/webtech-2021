require('dotenv').config({})
const Sequelize = require('sequelize')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'auth.db'
})

const User = sequelize.define('user', {
  googleId: Sequelize.STRING,
  token: Sequelize.STRING
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({
      googleId: profile.id
    })
    if (!user) {
      user = new User()
      user.googleId = profile.id
    }
    user.token = crypto.randomBytes(64).toString('hex')
    await user.save()
    done(null, user)
  } catch (err) {
    done(err)
  }
}))

const express = require('express')

const app = express()
app.use(passport.initialize())

app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'you are in' })
})

app.get('/fail', (req, res, next) => {
  res.status(401).json({ message: 'you have failed' })
})

app.get('/create', async (req, res, next) => {
  try {
    await sequelize.sync()
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'], session: false }))

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // console.log(req.user)
  // res.redirect('/')
  res.status(200).json({
    token: req.user.token
  })
})

app.listen(8080)
