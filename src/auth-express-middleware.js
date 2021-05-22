const expressJwt = require('express-jwt')

const getTokenFromHeader = (req) => {
	const {
		headers: { authorization },
	} = req

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1]
	}

	return null
}

const auth = expressJwt({
	secret: 'accessTokenSecret',
	credentialsRequired: false,
	algorithms: ['HS256'],
	userProperty: 'userContext',
	getToken: getTokenFromHeader,
})

module.exports = auth
