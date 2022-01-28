const Sequelize = require('sequelize')
const Op = Sequelize.Op

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const Person = sequelize.define('person', {
  name : Sequelize.STRING,
  age : Sequelize.INTEGER,
  salary : Sequelize.INTEGER
})

sequelize.sync({force : true})
  .then(() => Person.bulkCreate([{
    name : 'john',
    age : 24,
    salary : 1000
  },{
    name : 'jim',
    age : 30,
    salary : 2000
  },{
    name : 'jane',
    age : 27,
    salary : 3000
  }]))
  .then(() => Person.findAll({where : {name : 'john'}, raw : true}))
  .then((persons) => {
    console.warn(persons)
    return Person.findAll({where : {
      name : 'jim', 
      age : 30
    }, raw : true})
  })
  .then((persons) => {
    console.warn(persons)
    return Person.findAll({where : {
      salary : {
        [Op.gt] : 1000
      }
    }, raw : true})
  })
  .then((persons) => {
    console.warn(persons)
    return Person.findAll({
      where : {
        [Op.or] : [{
          salary : {
            [Op.gt] : 1000,
            [Op.lt] : 2500
          }
        },{
          age : {
            [Op.between] : [20,25]
          }
        },{
          name : {
            [Op.regexp] : '.+a.+'
          }
        }]
      }, 
      raw : true})
  })
  .then((persons) => {
    console.warn(persons)
  })
  .catch((err) => console.warn(err))