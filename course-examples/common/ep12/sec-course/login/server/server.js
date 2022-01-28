const express = require('express')
const Sequelize = require('sequelize')
const moment = require('moment')
const cors = require('cors')
const crypto = require('crypto')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'auth.db'
})

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

app.use(cors())
app.use(express.json())

const authRouter = express.Router()
const apiRouter = express.Router()
const adminRouter = express.Router()

apiRouter.use(async (req, res, next) => {
  const token = req.headers.auth
  try {
    const user = await User.findOne({
      where: {
        token: token
      }
    })
    if (user) {
      if (moment().diff(user.expiry, 'seconds') < 0) {
        res.locals.user = user
        next()
      } else {
        res.status(401).json({ message: 'token expired' })
      }
    } else {
      res.status(401).json({ message: 'unauthorized' })
    }
  } catch (err) {
    next(err)
  }
})

apiRouter.use(async (req, res, next) => {
  try {
    const user = res.locals.user
    if (user.userType === 'special') {
      next()
    } else {
      res.status(401).json({ message: 'you need to be special' })
    }
  } catch (err) {
    next(err)
  }
})

const perm = async (req, res, next) => {
  const user = res.locals.user
  try {
    const permission = await Permission.findOne({
      where: {
        userId: user.id,
        resourceId: req.params.rid
      }
    })
    if (permission) {
      next()
    } else {
      res.status(401).json({ message: 'this is not your resource' })
    }
  } catch (err) {
    next(err)
  }
}

app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/admin', adminRouter)

authRouter.post('/login', async (req, res, next) => {
  try {
    const credentials = req.body
    const user = await User.findOne({
      where: {
        username: credentials.username, password: credentials.password
      }
    })
    if (user) {
      user.expiry = moment().add(600, 'seconds')
      const token = crypto.randomBytes(64).toString('hex')
      user.token = token
      await user.save()
      res.status(200).json({ token: token })
    } else {
      res.status(401).json({ message: 'login not successful' })
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

apiRouter.get('/test', function (req, res) {
  res.status(200).send('you are in the api')
})

apiRouter.post('/users/:uid/resources', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.uid)
    if (user) {
      const resource = await Resource.create(req.body)
      const permission = new Permission()
      permission.permType = 'read'
      permission.userId = user.id
      permission.resourceId = resource.id
      await permission.save()
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  } catch (err) {
    next(err)
  }
})

apiRouter.get('/users/:uid/resources/:rid', perm, async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.rid)
    if (resource) {
      res.status(200).json(resource)
    } else {
      res.status(404).json({ message: 'resource not found' })
    }
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).json({ message: 'server error' })
})

app.listen(8080)
