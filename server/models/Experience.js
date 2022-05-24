const { STRING, Model, TEXT } = require('sequelize')

module.exports = (sequelize) => {
  class Experience extends Model { }
  Experience.init({
    title: {
      type: STRING,
    },
    employer: {
      type: STRING,
    },
    location: {
      type: STRING,
    },
    employmentperiods: {
      type: STRING,
    },
    description: {
      type: TEXT,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'experience'
  })

  return Experience
}