const { chromium } = require('playwright')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const main = async () => {
  const screenshotBuffer = await getScreenshot()
  sendEmail(screenshotBuffer)
}

const getScreenshot = async () => {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(60000)
    await page.goto('https://www.wsj.com/market-data/bonds', {
      waitUntil: 'networkidle',
    })
    await page.click('div[name="libor-rates-table"]')
    // const screenshotBuffer = await page.screenshot({ path: `libor.png` })
    const screenshotBuffer = await page.screenshot()
    const base64Buffer = screenshotBuffer.toString('base64')
    await browser.close()
    return base64Buffer
  } catch (error) {
    await browser.close()
    console.log(error.message)
  }
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
