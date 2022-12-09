import puppeteer from 'puppeteer'
import { execSync } from 'child_process'

export const main = async () => {
	await getScreenshot(
		'https://www.wsj.com/market-data/bonds',
		'div[name="libor-rates-table"]',
		'wsj',
		'load'
	)
	await getScreenshot(
		'https://www.cmegroup.com/market-data/cme-group-benchmark-administration/term-sofr.html',
		'.last-updated',
		'cme'
	)

	zipScreenshots()
}

const getScreenshot = async (
	site,
	selector,
	type,
	waitUntil = 'networkidle2'
) => {
	const browser = await puppeteer.launch({ headless: true })
	try {
		const page = await browser.newPage()
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
		)
		await page.goto(site, { waitUntil })
		await page.setViewport({ width: 1150, height: 850 })
		// await page.waitForSelector(selector)
		await page.click(selector)
		await page.screenshot({
			path: `./screenshots/${type}_${getFormattedDate()}.png`,
		})

		await browser.close()
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
	execSync(`zip -r ../libor_rates *`, {
		cwd: './screenshots',
	})
}

// main()
