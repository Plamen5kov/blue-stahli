const { STRING, Model, TEXT } = require('sequelize')

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
      type: TEXT,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'certification'
  })

  return Certification
}