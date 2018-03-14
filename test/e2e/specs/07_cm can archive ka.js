module.exports = {
  'CM can Archive KA 2': function (browser) {
    const devServer = browser.globals.devServerURL;
    console.log(devServer);
    browser
      .url(devServer)
      .maximizeWindow()
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
      .click('i[class=ti-layers]')
      .useXpath()
      .click('//a[text()="Edit"]')
      .waitForElementPresent('//table/tbody/tr[9]/th[2]/a[1]/i', 5000)
      .click('//table/tbody/tr[9]/th[2]/a[1]/i')
      .assert.elementPresent('//div/div/button[4]')
      .click('//div/div/button[4]')
      .acceptAlert()
      .useCss()
      .waitForElementPresent('i[class=ti-unlock]', 5000)
      .click('i[class=ti-unlock]')
      .assert.elementPresent('i[class=ti-lock]')
      .end();
  },
};
