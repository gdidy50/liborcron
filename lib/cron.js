const cron = require('node-cron')
const { firefox } = require('playwright')
const child_process = require('child_process')

const main = async () => {
	await getScreenshot(
		'https://www.wsj.com/market-data/bonds',
		'div[name="libor-rates-table"]',
		'wsj',
		'load'
	)
	await getScreenshot(
		'https://www.cmegroup.com/market-data/cme-group-benchmark-administration/term-sofr.html',
		'text=CME TERM SOFR (%)',
		'cme'
	)

	zipScreenshots()
	// sendEmail(screenshotBuffer)
}

const getScreenshot = async (site, id, type, waitUntil = 'networkidle') => {
	const browser = await firefox.launch()
	try {
		const page = await browser.newPage()
		page.setDefaultTimeout(90000)
		await page.setViewportSize({ width: 1150, height: 850 })
		await page.goto(site, {
			waitUntil: waitUntil,
		})

		await page.locator(id).click()
		const screenshotBuffer = await page.screenshot({
			path: `./screenshots/${type}_${getFormattedDate()}.png`,
		})
		// const screenshotBuffer = await page.screenshot()
		// const base64Buffer = screenshotBuffer.toString('base64')
		await browser.close()
		// return base64Buffer
	} catch (error) {
		await browser.close()
		console.log(error.message)
	}
}

const getFormattedDate = () => {
	const now = new Date()
	return `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`
}

const zipScreenshots = () => {
	child_process.execSync(`zip -r ../libor_rates *`, {
		cwd: './screenshots',
	})
}

cron.schedule('0 * * * *', () => {
	console.log('⌛️ running liborcron...')
	main()
})
