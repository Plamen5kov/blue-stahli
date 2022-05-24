const { StatusCodes } = require('http-status-codes')
const { Sequelize } = require('sequelize')
const { models } = require('../db/')
const contentProvider = require('../services/content-provider')
const Queue = require('bull')
const jobQueue = new Queue('jobs', 'redis://redis:6379')
const uuid = require('uuid')
const processor = require('../services/processor')


// Public Route
// GET /api/v1/contentProvider
const getContent = async (req, res, next) => {
  req.body.jobId = uuid.v4()

  jobQueue.process(async (job) => {
    const { username, password, url, jobId } = req.body
    try {
      console.log(`processing job: ${jobId}`)
        const extractedData = await contentProvider.init(
          __dirname,
          { username, password },
          url
        )

        return await models.User.create({
          id: uuid.v4(),
          name: extractedData.userInfo.name,
          about: extractedData.userInfo.about
        })

    } catch (err) {
      console.log(err.message)
    }
  })

  jobQueue.add(req.body)



  jobQueue.on("error", (error) => {
    console.log(error)
  })

  jobQueue.on("waiting", (waiting) => {
    console.log("job is waiting")
  })

  jobQueue.on("active", (activeJob) => {
    console.log("job is active")
  })

  jobQueue.on("completed", (completed) => {
    console.log("completed")
  })
  //prepare for models


  //save to db
  return res.status(StatusCodes.OK).json({ msg: `job: ${req.body.jobId} added to queue` })
}

module.exports = {
  getContent
}
