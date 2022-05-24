const { STRING, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Certification extends Model { }
  Certification.init({
    title: {
      type: STRING,
    },
    employer: {
      type: STRING,
    },
    certificationperiod: {
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

  return Certification
}