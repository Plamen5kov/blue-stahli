const { StatusCodes } = require('http-status-codes')
const { models } = require('../db/')
const fs = require('fs')

// Public Route
// GET /api/v1/download:id
const download = async (req, res, next) => {
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
  const user = await models.User.findOne(filter)

  if (fs.existsSync(user.pdfPath)) return res.status(StatusCodes.OK).sendFile(user.pdfPath)
  else res.status(StatusCodes.BAD_REQUEST).json({ msg: "no such file" })
}

module.exports = {
  download
}
