const { firefox } = require('playwright')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

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

const sendEmail = (base64Buffer) => {
	try {
		const date = new Date().toLocaleString()
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		})

		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: process.env.RECIPIENT,
			subject: `LIBOR Rates for ${date}`,
			text: `Attached are the LIBOR rates for ${date}.`,
			attachments: [
				{
					//data uri
					path: `data:image/png;base64,${base64Buffer}`,
				},
			],
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error)
			} else {
				console.log('Email sent: ' + info.response)
			}
		})
	} catch (error) {
		console.log(error.message)
	}
}

main()
