// processor.js
module.exports = async (jobId, username, password, url) => {
    return async (job, done) => {
        // Do some heavy work

        try {
            const extractedData = await contentProvider.init(
                __dirname,
                { username, password },
                url
            )

            await models.User.create({
                name: extractedData.userInfo.name,
                about: extractedData.userInfo.about
            })

            done()

        } catch (e) {
            // change job status to failed
            console.log(`Job[${job.id}] failed:`)
            console.log(e)
            done()
        }
    }
}

