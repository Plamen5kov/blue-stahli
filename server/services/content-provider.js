const puppeteer = require('puppeteer')
const { PupeteerError } = require('../errors')

const login = async (page, credentials, url) => {
    try {
        await page.goto(url, {
            waitUntil: 'load',
            timeout: 10 * 1000
        })
        await page.setViewport({ width: 1684, height: 1235 })

        //click sign in
        await page.waitForSelector('.d-none > .d-flex > .d-flex > .d-flex > .d-none')
        await page.click('.d-none > .d-flex > .d-flex > .d-flex > .d-none')

        //enter username
        await page.waitForSelector('#modalUserEmail')
        await page.click('#modalUserEmail')
        await page.type('#modalUserEmail', credentials.username)

        //enter password
        await page.waitForSelector('#modalUserPassword')
        await page.click('#modalUserPassword')
        await page.type('#modalUserPassword', credentials.password)

        //click sign in
        await page.waitForSelector('.d-flex > .css-n6mdyb > .d-flex > .gd-ui-button > .css-2etp8b')
        await page.click('.d-flex > .css-n6mdyb > .d-flex > .gd-ui-button > .css-2etp8b')
        await page.waitForNavigation()
    } catch (e) {
        throw new PupeteerError(`Unable to login: check credentials: ${e.message}`)
    }
}

const logout = async (page) => {
    try {
        await page.waitForSelector('.AccountPopupStyles__avatar', { visible: true })
        await page.click('.AccountPopupStyles__avatar', { visible: true })

        //click on logout
        await page.evaluate(() => { document.querySelector('a[href="/logout.htm"]').click() })
        await page.waitForNavigation()
    } catch (e) {
        throw new PupeteerError(`Unable to logout: ${e.message}`)
    }
}

const openProfile = async (page) => {
    try {
        await page.waitForSelector('.accountPopup__AccountPopupStyles__avatar', { visible: true })
        await page.click('.accountPopup__AccountPopupStyles__avatar', { visible: true })

        //click on member profile
        await page.evaluate(() => { document.querySelector('a[href="/member/profile/index.htm"]').click() });
        await page.waitForNavigation()

        //close popup
        await page.waitForSelector('div[class^=BadgeModalStyles__closeBtn]', { visible: true })
        await page.click('div[class^=BadgeModalStyles__closeBtn]', { visible: true })
    } catch (e) {
        throw new PupeteerError(`Unable to open profile: ${e.message}`)
    }
}


const downloadPdf = async (page, downloadPath) => {
    // try {
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    })

    await page.evaluate(() => {
        Array.from(document.querySelectorAll('div[class^=profileInfoStyle__caption]'))
            .filter(x => x.innerHTML === "Download PDF")[0] //find download pdf text
            .parentNode.parentNode.firstChild // relative path to download button
            .click()
    })
    // } catch (e) {
    //     throw new PupeteerError(`Unable to download pdf: ${e.message}`)
    // }
}

const viewAsEmployer = async (page) => {
    try {
        await page.evaluate(() => {
            Array.from(document.querySelectorAll('div[class=selectedLabel]'))
                .filter(c => c.innerHTML.contains("View as:") && c.innerHTML.contains("arrowDown"))[0]
                .click()
        })
        await page.evaluate(() => {
            Array.from(document.querySelectorAll('span[class=dropdownOptionLabel]'))
                .filter(c => c.innerHTML.contains("Employer"))[1]
                .click()
        })
    } catch (e) {
        throw new PupeteerError(`Unable to open view as employer view: ${e.message}`)
    }
}

const waitForPdfToDownload = async (downloadPath) => new Promise((resolve, reject) => {
    const path = require('path')
    var inter = setInterval(() => {
        const foundFile = require('fs').readdirSync(downloadPath).filter(x => x.endsWith(".pdf"))
        if (foundFile) resolve(path.join(downloadPath, ...foundFile))
    }, 1000);
    setTimeout(() => {
        clearInterval(inter)
        resolve("couldn't download file")
    }, 10 * 1000)
})



const extractUserData = async (page) => {
    try {
        return await page.evaluate(() => {
            //TODO: plamen5kov: handle out of bounds exception (wrapper)

            //get employee info
            const userInfo = {
                name: Array.from(document.querySelectorAll('h3[class*=SectionHeaderStyles__name]'))[0].innerText,
                about: document.querySelectorAll('#AboutMe > p')[0].innerText
            }

            //experience
            const experienceSection = document.querySelector('div[class^="experienceStyle__experience"]')
            const titles = Array.from(experienceSection.querySelectorAll('h3[data-test="title"]')).map(x => x.innerText)
            const employers = Array.from(experienceSection.querySelectorAll('div[data-test="employer"]')).map(x => x.innerText)
            const locations = Array.from(experienceSection.querySelectorAll('label[data-test="location"]')).map(x => x.innerText)
            const employmentperiods = Array.from(experienceSection.querySelectorAll('div[data-test="employmentperiod"]')).map(x => x.innerText)
            const descriptions = Array.from(experienceSection.querySelectorAll('p[data-test="description"]')).map(x => x.innerText)

            const experience = []
            for (let index = 0; index < titles.length; index++) {
                const tmp = {
                    title: titles[index],
                    employer: employers[index],
                    location: locations[index],
                    employmentperiods: employmentperiods[index],
                    description: descriptions[index]
                }
                experience.push(tmp)
            }

            //skills
            const skillsSection = document.querySelector('div[data-test="skillList"]')
            const skills = Array.from(skillsSection.querySelectorAll('span[title]')).map(x => x.innerText)

            //education
            const education = Array.from(document.querySelectorAll('li[type="education"]')).map(educationNode => {
                return {
                    university: educationNode.querySelector('h3[data-test="university"]').innerText,
                    degree: educationNode.querySelector('div[data-test="degree"]').innerText,
                    location: educationNode.querySelector('label[data-test="location"]').innerText,
                    graduationDate: educationNode.querySelector('div[data-test="graduationDate"]').innerText,
                    description: educationNode.querySelector('p[data-test="description"]').innerText
                }
            })

            //certification
            const certification = Array.from(document.querySelectorAll('li[type="certification"]')).map(certificationNode => {
                return {
                    title: certificationNode.querySelector('div[data-test="title"]').innerText,
                    employer: certificationNode.querySelector('div[data-test="employer"]').innerText,
                    certificationperiod: certificationNode.querySelector('div[data-test="certificationperiod"]').innerText,
                    description: certificationNode.querySelector('p[data-test="description"]').innerText
                }
            })

            return {
                userInfo,
                experience,
                skills,
                education,
                certification
            }
        })
    } catch (e) {
        throw new PupeteerError(`Unable to extract user data: ${e.message}`)
    }
}

const initializeBrowser = async () => {
    try {
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        })
        return browser
    } catch (e) {
        throw new PupeteerError(`Unable to extract user data: ${e.message}`)
    }
}

const init = async (browserDownloadPath, credentials, url) => {
    try {

        const browser = await initializeBrowser()

        const page = await browser.newPage()

        await login(page, credentials, url)

        await openProfile(page)

        const downloadPath = browserDownloadPath || __dirname
        downloadPdf(page, downloadPath)

        await viewAsEmployer(page)

        const extractedData = await extractUserData(page)
        const pathToPdf = await waitForPdfToDownload(downloadPath)

        await logout(page)

        browser.close()

        extractedData.pathToPdf = pathToPdf

        return extractedData
    } catch (e) {
        throw new PupeteerError(`something happened: ${e.message}`)
    }
}

module.exports = {
    init
}

// init(__dirname, { username: 'ravi.van.test@gmail.com', password: 'ravi.van.test@gmail.com' }, 'https://www.glassdoor.com/index.htm')