import express from 'express'
import fs from 'fs'
import './lib/cron.js'

const app = express()
const port = 3000

app.get('/libor-rates/download', async (req, res) => {
	res.download('./libor_rates.zip')
})

app.get('/libor-rates', async (req, res) => {
	fs.readdir('./screenshots', (err, files) => {
		if (err) return res.status(500).send('unable to scan directory: ' + err)
		res.status(200).send(files)
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
