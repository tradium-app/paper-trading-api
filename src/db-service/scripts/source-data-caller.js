const { exec } = require('child_process')
require('../../config/env')

const db_url = process.env.DATABASE_URL
const sourceDataFilePath = './src/db-service/scripts/source-data.js'
const script = `mongo ${db_url} ${sourceDataFilePath}`

exec(script, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`)
		return
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`)
		return
	}
	console.log(`stdout: ${stdout}`)
})
