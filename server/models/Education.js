const { STRING, Model, TEXT } = require('sequelize')

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
      type: TEXT,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'education'
  })

  return Education
}
