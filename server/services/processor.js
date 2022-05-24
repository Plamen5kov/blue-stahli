const Queue = require('bull')
const uuid = require('uuid')
const { models } = require('../db/')
const contentProvider = require('../services/content-provider')

const jobQueue = new Queue('jobs', 'redis://redis:6379')
const paralellJobsRunningAtOneTime = 5

jobQueue.process(paralellJobsRunningAtOneTime, async (job) => {
    const { username, password, url, jobId } = job.data

    try {
        console.log(`processing job: ${jobId}`)
        const extractedData = await contentProvider.init(
            __dirname,
            { username, password },
            url
        )

        const createdUser = await models.User.create({
            id: uuid.v4(),
            name: extractedData.userInfo.name,
            about: extractedData.userInfo.about
        })

        return Promise.resolve({ createdUser });

    } catch (error) {
        Promise.reject(error);
    }
})

const addJob = (data) => {
    jobQueue.add(data)
};

module.exports = {
    addJob
}