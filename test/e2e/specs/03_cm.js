module.exports = {
	'CM can Reject KA 1': function (browser) {
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
		  	.click('i[class=ti-layers')
		  	.useXpath()
		  	.click('//a[text()="Edit"]')
		  	.waitForElementPresent('//table/tbody/tr[1]/th[2]/a[1]/i', 5000)
		  	.click('//table/tbody/tr[1]/th[2]/a[1]/i')
		  	.useCss()
		  	.waitForElementPresent('button[type=submit]', 5000)
		  	.assert.elementPresent('button[type=submit]')
		  	.assert.elementPresent('input[name=title]')
		  	.clearValue('input[name=title]')
		  	.setValue('input[name=title]', 'CM edited title text - KA 1 - Rejected')
		  	.useXpath()
		  	.assert.elementPresent('//div/div/button[2]')
		  	.click('//div/div/button[2]')
		  	.acceptAlert()
		  	.useCss()
		  	.waitForElementPresent('button[type=submit]', 5000)
		  	.click('button[type=submit]')
		  	.waitForElementPresent('div[class="toast-container toast-top-full-width"]', 5000)
		  	.assert.elementPresent('div[class="toast-container toast-top-full-width"]')
		  	.refresh();
	},
	'CM can Remove KA 1': function (browser) {
		browser
			.waitForElementPresent('i[class=ti-layers]', 5000)
		  	.click('i[class=ti-layers]')
		  	.useXpath()
		  	.click('//a[text()="Edit"]')
		  	.waitForElementPresent('//table/tbody/tr/th[2]/a[1]/i', 5000)
		  	.click('//table/tbody/tr/th[2]/a[1]/i')
		  	.useXpath()
		  	.assert.elementPresent('//div/div/button[4]')
		  	.click('//div/div/button[4]')
		  	.acceptAlert()
		  	.useCss()
		  	.waitForElementPresent('i[class=ti-unlock]', 5000)
		  	.click('i[class=ti-unlock]')
			.assert.elementPresent('i[class=ti-lock]')
			.end();
	}
};
