const Queue = require('bull')
const uuid = require('uuid')
const { models } = require('../db/')
const contentProvider = require('../services/content-provider')
const { PupeteerError } = require('../errors')

const jobQueue = new Queue('jobs', 'redis://redis:6379')
const paralellJobsRunningAtOneTime = 5

jobQueue.process(paralellJobsRunningAtOneTime, async (job) => {
    const { username, password, url, jobId } = job.data

    try {
        const extractedData = await contentProvider.init(
            "",
            { username, password },
            url
        )

        const createdUser = await models.User.create({
            id: uuid.v4(),
            name: extractedData.userInfo.name,
            about: extractedData.userInfo.about,
            pdfPath: extractedData.pathToPdf,
            experiences: extractedData.experience,
            certifications: extractedData.certification,
            educations: extractedData.education,
        }, {
            include: [
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
                }
            ]
        })

        const skills = await models.Skill.bulkCreate(extractedData.skills.map(skill => { return { name: skill } }))

        createdUser.setSkills(skills)

        return Promise.resolve(true)

    } catch (e) {
        if (e instanceof PupeteerError) {
            await models.Job.create({ id: jobId, status: "pupeteer error", errMessage: { msg: e.toString() } })
        } else if (e instanceof Error) {
            await models.Job.create({ id: jobId, status: "db error", errMessage: { msg: e.toString() } })
        }
        Promise.reject(error);
    }
})

const addJob = (data) => {
    jobQueue.add(data)
};

module.exports = {
    addJob
}