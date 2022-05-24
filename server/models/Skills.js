const { STRING, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Skill extends Model { }
  Skill.init({
    name: {
      type: STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true
  })

  return Skill
}