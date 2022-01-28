const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const Book = require('./book')

sequelize.sync({ force: true })
  .then(() => console.log('created'))
  .catch((error) => console.log(error))
