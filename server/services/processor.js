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

        return Promise.resolve(true);

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