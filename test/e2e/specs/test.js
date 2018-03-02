// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
// System Admin // ssined@insight-kmt.com
// Executive // bboss@insight-kmt.com
// Content Manager // csmith@insight-kmt.com
// Author // pjacobs@insight-kmt.com
// Password:"abcd1234!"


module.exports = {
  'SA can Log In': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser
      .url(devServer)
      .maximizeWindow()
      .assert.elementPresent('i[class=ti-lock]')
      .click('i[class=ti-lock]')
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'ssined@insight-kmt.com')      
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('i[class=ti-unlock]', 5000)
      .assert.elementPresent('i[class=ti-unlock]')
  },

  'SA can Add User and User can Log In' : function (browser) {
    browser
      .click('i[class=ti-user]')
      .useXpath()
      .click('//a[text()="New"]')
      .useCss()
      .waitForElementPresent('input[name=fullname]', 10000)
      .assert.elementPresent('input[name=fullname]')
      .setValue('input[name=fullname]', "Test User")
      .assert.elementPresent('input[name=email]')
      .setValue('input[name=email]', "testuser@test.com")
      .assert.elementPresent('input[name=password]')
      .setValue('input[name=password]', "abcd1234!")
      .assert.elementPresent('input[name=confirmed]')
      .setValue('input[name=confirmed]', "abcd1234!")
      .click('input[id=roleAuthor]')
      .click('button[type=submit]')
      .click('i[class=ti-unlock]')
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .click('i[class=ti-lock')
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'testuser@test.com')      
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('i[class=ti-layers]', 5000)
      .assert.elementPresent('i[class=ti-layers]')

  },

  'Author can create KA' : function (browser) {
    browser      
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="New"]')
      .useCss()
      .waitForElementPresent('input[name=title]', 5000)
      .assert.elementPresent('input[name=title]')
      .setValue('input[name=title]', 'This is a test title')
      .assert.elementPresent('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('.CodeMirror textarea').keys('This is body text')
      .assert.elementPresent('input[name=categories]')
      .sendKeys('input[name=categories]', 'created, via, nightwatch')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh()
  },

  'Author can edit KA' : function (browser) {
    browser
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="Edit"]')
      .useCss()
      .waitForElementPresent('a[class=article]', 5000)
      .click('a[class=article]')
      .useXpath()
      .assert.elementPresent('//button[text()="Update"]')
      .useCss()
      .assert.elementPresent('input[name=title]')
      .clearValue('input[name=title]')
      .setValue('input[name=article]', 'Author Edited title text')
      .click('select[id=status')
      .click('option[value="pending approval"]')
      .useXpath()
      .click('//button[text()="Update"]')
      .useCss()
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh()
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .click('i[class=ti-lock')      
      // .end();
  },
  'CM can edit, Approve, and Publish KA' : function (browser) {
    browser
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .assert.elementPresent('i[class=ti-lock]')
      .click('i[class=ti-lock]')
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'csmith@insight-kmt.com')      
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('i[class=ti-unlock]', 5000)
      .assert.elementPresent('i[class=ti-unlock]')
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="Edit"]')
      .useCss()
      .waitForElementPresent('a[class=article]', 5000)
      .click('a[class=article]')
      .useXpath()
      .assert.elementPresent('//button[text()="Update"]')
      .useCss()
      .assert.elementPresent('input[name=title]')
      .clearValue('input[name=title]')
      .setValue('input[name=article]', 'CM edited title text')
      .click('select[id=status')
      .click('option[value="approved"]')
      .useXpath()
      .click('//button[text()="Update"]')
      .useCss()
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh()
      .click('i[class=ti-unlock]')
      .assert.elementPresent('i[class=ti-lock]')      
      // .end();
  },

  'SA can Remove User and User can no longer Log In' : function (browser) {
    browser
      .waitForElementPresent('i[class=ti-lock]')
      .click('i[class=ti-lock]')
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'ssined@insight-kmt.com')      
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('i[class=ti-unlock]', 5000)
      .assert.elementPresent('i[class=ti-unlock]')
      .click('i[class=ti-user]')
      .useXpath()
      .click('//a[text()="Edit"]')
      .waitForElementPresent('*[@id="app"]/div/div/div/section/div/div/div/div/div[3]/table/tbody/tr[5]/th[2]/a[2]/i', 5000)
      .click('*[@id="app"]/div/div/div/section/div/div/div/div/div[3]/table/tbody/tr[5]/th[2]/a[2]/i')
      .useCss()
      .keys(browser.Keys.RETURN)
      .click('i[class=ti-unlock]')
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .click('i[class=ti-lock')
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'testuser@test.com')      
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresemt('div[class="toast-container toast-top-full-width"]')
      .refresh()
      .click('i[class=ti-user]')
      .useXpath()
      .click('//a[text()="Edit"]')
      .useCss()
      .assert.elementNotPresent('*[@id="app"]/div/div/div/section/div/div/div/div/div[3]/table/tbody/tr[5]/th[2]/a[2]/i')
      .end()
}
};