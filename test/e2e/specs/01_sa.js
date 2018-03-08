module.exports = {
	'SA can Log In': function test(browser) {
		// automatically uses dev Server port from /config.index.js
		// default: http://localhost:8080
		// see nightwatch.conf.js
		const devServer = browser.globals.devServerURL;
		console.log(devServer);
		browser
			.url(devServer)
			.maximizeWindow()
			.waitForElementPresent('i[class=ti-lock]', 5000)
			.assert.elementPresent('i[class=ti-lock]')
			.click('i[class=ti-lock]')
			.assert.elementPresent('input[id=email]')
			.setValue('input[id=email]', 'ssined@insight-kmt.com')
			.waitForElementPresent('input[id=password]', 5000)
			.assert.elementPresent('input[id=password]')
			.setValue('input[id=password]', 'abcd1234!')
			.click('button[type=submit]')
			.waitForElementPresent('i[class=ti-unlock]', 5000)
			.assert.elementPresent('i[class=ti-unlock]');
	},
	'SA can Add User': function (browser) {
		browser
			.assert.elementPresent('i[class=ti-user]')
			.click('i[class=ti-user]')
			.waitForElementPresent('i[class=ti-user]', 5000)
			.assert.elementPresent('i[class=ti-user]')
			.useXpath()
			.waitForElementPresent('//a[text()="New"]', 5000)
			.assert.elementPresent('//a[text()="New"]')
			.click('//a[text()="New"]')
			.useCss()
			.waitForElementPresent('input[name=fullname]', 5000)
			.assert.elementPresent('input[name=fullname]')
			.setValue('input[name=fullname]', 'Test User')
			.assert.elementPresent('input[name=email]')
			.setValue('input[name=email]', 'testuser@test.com')
			.assert.elementPresent('input[name=password]')
			.setValue('input[name=password]', 'abcd1234!')
			.assert.elementPresent('input[name=confirmed]')
			.setValue('input[name=confirmed]', 'abcd1234!')
			.click('input[id=roleAuthor]')
			.click('button[type=submit]')
			.click('i[class=ti-unlock]')
			.waitForElementPresent('i[class=ti-lock]', 5000)
			.end();
	}
};