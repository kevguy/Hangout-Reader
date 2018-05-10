require('babel-register')
const config = require("../../config")

module.exports = {
	src_folders: ["tests/e2e/specs"],
	output_folder: "tests/e2e/reports",

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

	test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || 3000)
      }
    },

		// phantomjs: {
		// 	desiredCapabilities: {
		// 		browserName: "phantomjs",
		// 		javascriptEnabled: true,
		// 		acceptSslCerts: true,
		// 		"phantomjs.binary.path" : "./node_modules/.bin/phantomjs"
		// 	}
		// },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
      }
    }
	}
}
