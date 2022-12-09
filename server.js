import express from 'express'
import './lib/cron.js'

const app = express()
const port = 3000

app.get('/libor-rates/download', async (req, res) => {
	res.download('./libor_rates.zip')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
