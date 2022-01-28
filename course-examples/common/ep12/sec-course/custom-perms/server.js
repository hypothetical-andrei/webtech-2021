const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')
const sequelize = new Sequelize('node_security', 'app1', 'welcome123', {
	dialect : 'mysql'
})
const moment = require('moment')
const crypto = require('crypto')

const User = sequelize.define('users', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
  token: Sequelize.STRING,
  expiry: Sequelize.DATE,
  userType: Sequelize.STRING
})

const Resource = sequelize.define('resource', {
  content: Sequelize.STRING
})

const Permission = sequelize.define('permission', {
  permType: Sequelize.ENUM('read')
})

User.hasMany(Permission)
Resource.hasMany(Permission)

const app = express()

const authRouter = express.Router()
const apiRouter = express.Router()

const adminRouter = express.Router()

app.use(bodyParser.json())

apiRouter.use(async (req, res, next) => {
  if (req.headers.auth) {
    const token = req.headers.auth
    const user = await User.findOne({
      where: {
        token: token
      }  
    })
    if (user) {
      res.locals.user = user
      if (moment().diff(user.expiry) < 0) {
        next()
      } else {
        res.status(401).json({ message: 'token expired' })
      }
    } else {
      res.status(401).json({ message: 'no user with that token' })
    }
  } else {
    res.status(401).json({ message: 'you need a token' })
  }
})

apiRouter.use(async (req, res, next) => {
  const token = req.headers.auth
  // const user = await User.findOne({
  //   where: {
  //     token: token
  //   }  
  // })
  const user = res.locals.user
  if (user.userType === 'special') {
    next()
  } else {
  res.status(401).json({ message: 'you need to be special' })
  }
})

const perm = async (req, res, next) => {
  const token = req.headers.auth
  try {
    // const user = await User.findOne({
    //   where: {
    //     token: token
    //   }  
    // })
    const user = res.locals.user
    const perm = await Permission.findOne({
      where: {
        resourceId: req.params.rid,
        userId: user.id
      }
    })
    if (!perm) {
      res.status(401).json({ message: 'not your resource' })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

authRouter.post('/login', async (req, res, next) => {
  try {
    const credentials = req.body
    const user = await User.findOne({
      where: {
        username: credentials.username,
        password: credentials.password
      }
    })
    if (user) {
      token = crypto.randomBytes(64).toString('hex')
      user.token = token
      user.expiry = moment().add(600, 'seconds')
      await user.save()
      res.status(200).json({ token: token })
    } else {
      res.status(401).json({ message: 'not fine' })
    }
  } catch (err) {
    next(err)
  }
})

adminRouter.get('/create', async (req, res, next) => {
  try {
    await sequelize.sync({ force: true })
    await User.create({
      username: 'user1',
      password: 'pass1',
      userType: 'special'
    })
    await User.create({
      username: 'user2',
      password: 'pass2',
      userType: 'special'
    })
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

adminRouter.post('/users', async (req, res, next) => {
  try {
    await User.create(req.body)
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

apiRouter.get('/test', (req, res, next) => {
  res.status(201).json({ message: 'you are in'})
})

apiRouter.get('/users/:uid/resources/:rid', perm, async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.rid)
    if (resource) {
      res.status(200).json(resource)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (err) {
    next(err)
  }
})

apiRouter.post('/users/:uid/resources', async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body)
    const user = await User.findByPk(req.params.uid)
    const permission = new Permission()
    permission.permType = 'read'
    permission.userId = user.id
    permission.resourceId = resource.id
    await permission.save()
    res.status(201).json({ message: 'created' })
  } catch (err) {
    next(err)
  }
})

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).json({ message: 'server error' })
})

app.listen(8080)