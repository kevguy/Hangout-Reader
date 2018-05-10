module.exports = {
	"Website loads": (browser) => {
		const server = browser.globals.devServerURL

		browser
			.url(server)
			.waitForElementVisible("#app", 5000)
			.end()
	}
}
