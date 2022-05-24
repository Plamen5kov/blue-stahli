
const uuid = require('uuid')
const { StatusCodes } = require('http-status-codes')
const processor = require('../services/processor')

// Public Route
// GET /api/v1/contentProvider
const getContent = async (req, res, next) => {
  req.body.jobId = uuid.v4()

  processor.addJob(req.body)

  return res.status(StatusCodes.OK).json({ msg: `job: ${req.body.jobId} added to queue` })
}

module.exports = {
  getContent
}
