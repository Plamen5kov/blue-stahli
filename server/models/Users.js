const { Model, UUID, UUIDV4, STRING } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    name: {
      type: STRING,
      allowNull: false
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    about: {
      type: STRING
    },
    pdfPath: {
      type: STRING
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'users'
  })

  return User
}