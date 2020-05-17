const {
	Mutation: { storeFcmToken },
} = require('../resolvers')
import mockingoose from 'mockingoose'

describe('Resolvers Mutation storeFcmToken', () => {
	it('should create new fcm token on user collection', async () => {
		const mongooseSchema = require('../../db-service/database/mongooseSchema')
		mockingoose(mongooseSchema.User).toReturn(
			{
				ok: '1',
			},
			'update',
		)

		const response = await storeFcmToken(
			null,
			{
				input: {
					fcmToken: 'token123',
					countryCode: 'NEP',
				},
			},
			mongooseSchema,
		)

		expect(response.success).toBeTruthy()
	})
})
