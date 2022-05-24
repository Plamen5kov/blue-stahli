const { STRING, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Education extends Model { }
  Education.init({
    university: {
      type: STRING,
    },
    degree: {
      type: STRING,
    },
    location: {
      type: STRING,
    },
    graduationDate: {
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

  return Education
}
