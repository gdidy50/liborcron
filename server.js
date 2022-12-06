const express = require('express')
const app = express()
const port = 3000
require('./lib/cron')

app.get('/libor-rates', async (req, res) => {
	res.download('./libor_rates.zip')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
