module.exports = {
    'Author can edit KA after Rejection': function (browser) {
        const devServer = browser.globals.devServerURL;
        console.log(devServer);
        browser
            .url(devServer)
            .maximizeWindow()
            .waitForElementPresent('i[class=ti-lock]', 5000)
            .click('i[class=ti-lock')
            .assert.elementPresent('input[id=email]')
            .setValue('input[id=email]', 'testuser@test.com')
            .assert.elementPresent('input[id=password]')
            .setValue('input[id=password]', 'abcd1234!')
            .click('button[type=submit]')
            .waitForElementPresent('i[class=ti-layers]', 5000)
            .assert.elementPresent('i[class=ti-layers]')
            .click('i[class=ti-layers')
            .useXpath()
            .click('//a[text()="Edit"]')
            .waitForElementPresent('//table/tbody/tr/td[1]/a', 5000)
            .click('//table/tbody/tr/td[1]/a')
            .waitForElementPresent('//button[text()="Update"]', 5000)
            .assert.elementPresent('//button[text()="Update"]')
            .useCss()
            .assert.elementPresent('input[name=title]')
            .clearValue('input[name=title]')
            .setValue('input[name=title]', 'KA 1 - Previously Rejected')
            .click('select[id=status')
            .click('option[value="pending approval"]')
            .waitForElementPresent('button[type=submit]', 5000)
            .assert.elementPresent('button[type=submit]')
            .click('button[type=submit]')
            .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
            .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
            .refresh()
            .waitForElementPresent('i[class=ti-unlock]', 5000)
            .click('i[class=ti-unlock')
            .end();
    }
};