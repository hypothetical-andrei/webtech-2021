require('dotenv').config({})
const passport = require('passport')
const express = require('express')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

const Sequelize = require('sequelize')

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
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        where: {
          googleId: profile.id 
        }
      })
      if (!user) {
        user = new User()
        user.googleId = profile.id
        await user.save()
      } 
      console.warn('NEXT-ing')
      done(null, user)
    } catch (err) {
      console.warn(err)
      done(err)
    }
  }
))

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

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'], session: false } ))

app.get('/auth/google/callback',  passport.authenticate('google', { session: false }), (req, res) => {
    res.redirect('/')
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).json({ message: 'server error' })
})

app.listen(8080)