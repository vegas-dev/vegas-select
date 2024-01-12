module.exports = function (config) {
	const process = require("process");
	process.env.CHROME_BIN = require("puppeteer").executablePath();

	config.set({
		basePath: ".",
		frameworks: ["mocha", "chai"],
		files: [
			{ pattern: "dist/*.css", watched: false, included: true },
			{ pattern: "dist/*.js", type: "module", included: false, served: true },
		],
		proxies: {
			"/assets/": "/",
		},
		reporters: ["progress"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ["ChromeHeadlessNoSandbox"],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",

				flags: [
					"--disable-gpu",
					"--renderer",
					"--no-sandbox",
					"--no-service-autorun",
					"--no-experiments",
					"--no-default-browser-check",
					"--disable-dev-shm-usage",
					"--disable-setuid-sandbox",
					"--no-first-run",
					"--no-zygote",
					"--single-process",
					"--disable-extensions",
				],
			},
		},
		autoWatch: false,
		singleRun: true,
		browserDisconnectTimeout: 5000,
		browserDisconnectTolerance: 2,
	});
};
