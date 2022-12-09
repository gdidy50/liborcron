import { schedule } from 'node-cron'
import { main } from './screenshot-scraper.js'

schedule('0 * * * *', () => {
	console.log('⌛️ running liborcron...')
	main()
})
