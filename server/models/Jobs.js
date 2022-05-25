const { Model, UUID, UUIDV4, STRING, JSONB } = require('sequelize')

module.exports = (sequelize) => {
  class Job extends Model { }
  Job.init({
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    status: {
      type: STRING,
      allowNull: false,
    },
    errMessage: {
      type: JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: 'jobs'
  })

  return Job
}