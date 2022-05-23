const { StatusCodes } = require('http-status-codes')
const { Sequelize } = require('sequelize')

// Public Route
// GET /api/v1/contentProvider
const getContent = async (req, res) => {

  res.status(StatusCodes.OK).json({ msg: "success" })
}

module.exports = {
  getContent
}
