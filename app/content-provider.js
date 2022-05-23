const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()

        await page.goto('https://www.glassdoor.com/index.htm')
        await page.setViewport({ width: 1684, height: 1235 })

        //click sign in
        await page.waitForSelector('.d-none > .d-flex > .d-flex > .d-flex > .d-none')
        await page.click('.d-none > .d-flex > .d-flex > .d-flex > .d-none')

        //enter username
        await page.waitForSelector('#modalUserEmail')
        await page.click('#modalUserEmail')
        await page.type('#modalUserEmail', 'ravi.van.test@gmail.com')

        //enter password
        await page.waitForSelector('#modalUserPassword')
        await page.click('#modalUserPassword')
        await page.type('#modalUserPassword', 'ravi.van.test@gmail.com')

        //click sign in
        await page.waitForSelector('.d-flex > .css-n6mdyb > .d-flex > .gd-ui-button > .css-2etp8b')
        await page.click('.d-flex > .css-n6mdyb > .d-flex > .gd-ui-button > .css-2etp8b')
        await navigationPromise

        // open profile menu
        await page.waitForSelector('.accountPopup__AccountPopupStyles__avatar', { visible: true })
        await page.click('.accountPopup__AccountPopupStyles__avatar', { visible: true })

        //click on member profile
        await page.evaluate(() => { document.querySelector('a[href="/member/profile/index.htm"]').click() });
        await navigationPromise

        //close popup
        await page.waitForSelector('div[class^=BadgeModalStyles__closeBtn]', { visible: true })
        await page.click('div[class^=BadgeModalStyles__closeBtn]', { visible: true })
        await navigationPromise

        // download pdf
        await page.evaluate(() => {
            Array.from(document.querySelectorAll('div[class^=profileInfoStyle__caption]'))
                .filter(x => x.innerHTML === "Download PDF")[0]?. //find download pdf text
                parentNode?.parentNode?.firstChild?.click() // relative path to download button
        })


    } catch (e) {
        console.log(`Error while operating: ${e.message}`);
    }
})();