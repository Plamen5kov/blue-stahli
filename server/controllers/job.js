const { StatusCodes } = require('http-status-codes')
const { models } = require('../db/')

// Public Route
// GET /api/v1/job:id
const status = async (req, res, next) => {
  const { id } = req.params

  const jobStatus = await models.Job.findOne({ where: { id } })

  return res.status(StatusCodes.OK).json({ jobStatus })
}

module.exports = {
  status
}
