const { STRING, Model } = require('sequelize')

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
      type: STRING,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true
  })

  return Experience
}