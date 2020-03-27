const moment = require('moment-timezone')
const { userDbService } = require('../../db-service')

const getUsersWithCurrentTime = async () => {
	try {
		let usersWithCurrentTime = null
		const users = await userDbService.getUsers()
		if (users) {
			usersWithCurrentTime = users.map((user) => {
				const currentTime = moment()
					.tz(user.timeZone)
					.format('HH:m')

				return {
					...user,
					currentTime
				}
			})
		}
		return usersWithCurrentTime
	} catch (error) {
		console.log('______error______', error)
	}
}

module.exports = {
	getUsersWithCurrentTime
}
