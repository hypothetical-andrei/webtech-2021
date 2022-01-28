const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const Author = sequelize.define('author', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
})

const Message = sequelize.define('message', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT
  }
})

Author.hasMany(Message)

sequelize.sync({ force: true })
  .then(() => console.log('created'))
  .catch((error) => console.log(error))
