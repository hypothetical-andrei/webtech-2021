require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(passport.initialize())

const authRouter = express.Router()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
},
function (accessToken, refreshToken, profile, done) {
  done(null, profile)
}
))

app.use('/auth', authRouter)

authRouter.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], session: false }))

authRouter.get('/google/callback', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'], session: false }), (req, res) => {
  res.send({ message: 'done', user: req.user })
})

app.listen(8080)
