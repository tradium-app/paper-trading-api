module.exports = {
	requestDidStart() {
		return {
			didEncounterErrors(requestContext) {
				console.log('graphql error(s) from requestContext', requestContext.errors)
			},
		}
	},
}
