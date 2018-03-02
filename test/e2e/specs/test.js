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

  // 'Author can create KA' : function (browser) {
  //   browser      
  //     .click('i[class=ti-layers')
  //     .useXpath()
  //     .click('//a[text()="New"]')
  //     .useCss()
  //     .waitForElementPresent('input[name=title]', 5000)
  //     .assert.elementPresent('input[name=title]')
  //     .setValue('input[name=title]', 'This is a test title')
  //     .assert.elementPresent('input[name=article]')
  //     .setValue('input[name=article]', 'This is body text')
  //     .assert.elementPresent('input[name=categories]')
  //     .setValue('input[name=categories]', 'created, via, nightwatch')
  //     .click('button[type=submit]')
  //     .waitForElementPresent('div[class=toast-container]', 5000)
  //     .assert.elementPresent('div[class=toast-container]')
  // },

  'Author can edit KA' : function (browser) {
    browser
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="Edit"]')
      .useCss()
      .waitForElementPresent('a[class=article]', 5000)
      .click('a[class=article]')
      .waitForElementPresent('a[class=article]')
      .useXpath()
      .assert.elementPresent('//button[text()="Update"]')
      .useCss()
      .assert.elementPresent('input[name=title]')
      .clearValue('input[name=title]')
      .setValue('input[name=article]', 'Edited title text')
      .click('select[id=status')
      .click('option[value="pending approval"]')
      .useXpath()
      .click('//button[text()="Update"]')
      .useCss()
      // .end();
  }
};
