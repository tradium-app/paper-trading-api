import moment from 'moment-timezone'
import { verifyNoticiableTime } from '../notificationTime'

describe('Moment integration', () => {
	it('moment-timezone should return current time', () => {
		const now = moment()
			.tz('Asia/Kathmandu')
			.format('HH:mm')

		expect(now).not.toBe(null)
	})

	it('verifyNoticiableTime should return true', () => {
		const currentTime = moment()
			.tz('Asia/Kathmandu')
			.format('HH:mm')

		const eligibleTime = verifyNoticiableTime(currentTime)
		expect(eligibleTime).not.toBe(false)
	})
})
