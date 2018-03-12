module.exports = {
  'New Author User can Log In': function (browser) {
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
      .assert.elementPresent('i[class=ti-layers]');
  },

  'Author can create KA 1': function (browser) {
    browser
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="New"]')
      .useCss()
      .waitForElementPresent('input[name=title]', 5000)
      .assert.elementPresent('input[name=title]')
      .setValue('input[name=title]', 'Test KA 1')
      .assert.elementPresent('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('.CodeMirror textarea').keys('This is body text')
      .assert.elementPresent('input[name=categories]')
      .sendKeys('input[name=categories]', 'created, via, nightwatch')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh();
  },

  'Author can create KA 2': function (browser) {
    browser
      .waitForElementPresent('input[name=title]', 5000)
      .assert.elementPresent('input[name=title]')
      .setValue('input[name=title]', 'Test KA 2')
      .assert.elementPresent('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('div[class="CodeMirror cm-s-paper CodeMirror-wrap"]')
      .click('.CodeMirror textarea').keys('This is body text')
      .assert.elementPresent('input[name=categories]')
      .sendKeys('input[name=categories]', 'created, via, nightwatch')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh();
  },

  'Author can edit and submit KA 2': function (browser) {
    browser
      .waitForElementPresent('i[class=ti-layers', 5000)
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="Edit"]')
      .waitForElementPresent('//table/tbody/tr[2]/th[2]/a[1]/i', 5000)
      .click('//table/tbody/tr[2]/th[2]/a[1]/i')
      .assert.elementPresent('//button[text()="Update"]')
      .useCss()
      .assert.elementPresent('input[name=title]')
      .clearValue('input[name=title]')
      .setValue('input[name=title]', 'Author Edited title text - KA 2')
      .click('select[id=status')
      .click('option[value="pending approval"]')
      .useXpath()
      .click('//button[text()="Update"]')
      .useCss()
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh();
  },

  'Author can edit and submit KA 1': function (browser) {
    browser
      .waitForElementPresent('i[class=ti-layers', 5000)
      .click('i[class=ti-layers')
      .useXpath()
      .click('//a[text()="Edit"]')
      .waitForElementPresent('//table/tbody/tr[1]/th[2]/a[1]/i', 5000)
      .click('//table/tbody/tr[1]/th[2]/a[1]/i')
      .useCss()
      .waitForElementPresent('button[type=submit]', 5000)
      .assert.elementPresent('input[name=title]')
      .clearValue('input[name=title]')
      .setValue('input[name=title]', 'Author Edited title text - KA 1')
      .click('select[id=status')
      .click('option[value="pending approval"]')
      .assert.elementPresent('button[type=submit]')
      .click('button[type=submit]')
      .waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
      .assert.elementPresent('div[class="toast-container toast-top-full-width"]')
      .refresh()
      .waitForElementPresent('i[class=ti-unlock]', 5000)
      .click('i[class=ti-unlock')
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .end();
  },
};
