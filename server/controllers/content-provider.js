const { StatusCodes } = require('http-status-codes')
const { Sequelize } = require('sequelize')
const contentProvider = require('../services/content-provider')

// Public Route
// GET /api/v1/contentProvider
const getContent = async (req, res) => {

  //get credepntials and url from the encoded url request
  const { username, password, url } = req.body

  const extractedData = await contentProvider.init(
    __dirname,
    { username, password },
    url
  )

  //prepare for models


  //save to db

  res.status(StatusCodes.OK).json(extractedData)
  // res.status(StatusCodes.OK).json({ msg: "initialized job successfully" })
}

module.exports = {
  getContent
}
