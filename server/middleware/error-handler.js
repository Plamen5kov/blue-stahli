const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    customError.msg = `Cannot add or update a child row: a foreign key constraint fails. Make sure you have the correct params and id.`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
