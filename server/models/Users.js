const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true
  })

  return User
}