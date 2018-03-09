module.exports = {
  'Reader can browse KA by Category': function (browser) {
    const devServer = browser.globals.devServerURL;
    console.log(devServer);
    browser
      .url(devServer)
      .maximizeWindow()
      .waitForElementPresent('i[class=ti-lock]', 5000)
      .useXpath()
      .waitForElementPresent('//div/a/span', 5000)
      .click('//*[@id="app"]/div/div/div/section/div/div/div/div/div[2]/div/div/div[1]/div[2]/div/ul/li[1]/div/a')
      .waitForElementPresent('//*[@id="app"]/div/div/div/section/div/div/div/div/div[2]/div/div/div[1]/div[2]/div/ul/li[1]/ul/li/div/a', 5000)
      .click('//*[@id="app"]/div/div/div/section/div/div/div/div/div[2]/div/div/div[1]/div[2]/div/ul/li[1]/ul/li/div/a')
      .useCss()
      .waitForElementPresent('div[class=body_text]', 5000);
  },
  'Reader can Search for KA': function (browser) {
    browser
      .waitForElementPresent('i[class=ti-search]', 5000)
      .click('i[class=ti-search')
      .assert.elementPresent('input[name=search]')
      .setValue('input[name=search]', 'nightwatch')
      .click('button[type=submit]')
      .useXpath()
      .waitForElementPresent('//*[@id="result-articles"]/li/a', 5000)
      .click('//*[@id="result-articles"]/li/a')
      .useCss();
  },
  'Reader can read KA': function (browser) {
    browser
      .waitForElementPresent('div[class=body_text]', 5000)
      .assert.elementPresent('div[class=body_text]');
  },
  'Reader can give feedback': function (browser) {
    browser
      .waitForElementPresent('button[id=btnUpvote]', 5000)
      .assert.elementPresent('button[id=btnUpvote]')
      .click('button[id=btnUpvote]')
      .end();
  },
};
