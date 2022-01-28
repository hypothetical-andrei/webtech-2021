const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db'
})

sequelize.authenticate()
  .then(() => console.log('we are connected'))
  .catch((error) => console.log(error))
