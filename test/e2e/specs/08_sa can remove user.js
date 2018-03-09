module.exports = {
  'SA can remove User': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;
    console.log(devServer);
    browser
      .url(devServer)
      .maximizeWindow()
      .waitForElementPresent('i[class=ti-lock]', 5000)
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
      .waitForElementPresent('//table/tbody/tr[5]/th[2]/a[2]/i', 5000)
      .click('//table/tbody/tr[5]/th[2]/a[2]/i')
      .pause(1000)
      .acceptAlert()
      .useCss()
      .click('i[class=ti-unlock]')
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .click('i[class=ti-lock');
  },
  'User Can no longer Log In': function test(browser) {
    browser
      .assert.elementPresent('input[id=email]')
      .setValue('input[id=email]', 'testuser@test.com')
      .assert.elementPresent('input[id=password]')
      .setValue('input[id=password]', 'abcd1234!')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .end();
  },
};
