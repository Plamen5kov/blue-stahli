const { StatusCodes } = require('http-status-codes')
const { models } = require('../db/')

// Public Route
// GET /api/v1/users:id
const userInfo = async (req, res, next) => {
  const { email } = req.query

  const filter = {}

  if (email) filter.where = { email }

  filter.include = [
    {
      model: models.Experience,
      as: 'experiences'
    },
    {
      model: models.Certification,
      as: 'certifications'
    },
    {
      model: models.Education,
      as: 'educations'
    },
    {
      model: models.Skill
    }
  ]
  const user = await models.User.findAll(filter)

  return res.status(StatusCodes.OK).json({ user })
}

module.exports = {
  userInfo
}
