module.exports = (sequelize, DataTypes) => {
  return sequelize.define('book', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  })
}
