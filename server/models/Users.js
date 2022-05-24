const { DataTypes, Model, UUID, UUIDV4 } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    uuid: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true
  })

  return User
}