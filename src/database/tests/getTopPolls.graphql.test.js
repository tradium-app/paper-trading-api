const TestDbServer = require('../../db-service/tests/test-db-server.js')
const { graphqlTestCall } = require('./graphqlTestCall')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const query = `
query getTopPolls {
  getTopPolls{
    _id
    question
      options{
        _id
      	text
      	order
      	totalVotes
    }
    author{
      _id
      userUrlId
      name
    }
  }
}
`

describe('Graphql Resolvers', () => {
	it('get getTopPolls', async () => {
		const topPolls = await graphqlTestCall(query)
		expect(topPolls.data.getTopPolls).toBeDefined()
	})
})
